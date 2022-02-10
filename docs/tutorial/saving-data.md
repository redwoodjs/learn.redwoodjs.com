---
id: saving-data
title: "Saving Data"
sidebar_label: "Saving Data"
---

### Add a Contact Model

Let's add a new database table. Open up `api/db/schema.prisma` and add a Contact model after the Post model that's there now:

```javascript {20-26}
// api/db/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = "native"
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  createdAt DateTime @default(now())
}

model Contact {
  id        Int @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

> **Prisma syntax for optional fields**
>
> To mark a field as optional (that is, allowing `NULL` as a value) you can suffix the datatype with a question mark, e.g. `name String?`. This will allow `name`'s value to be either a `String` or `NULL`.

Next we create and apply a migration:

```bash
yarn rw prisma migrate dev
```

We can name this one something like "create contact".

### Create an SDL & Service

Now we'll create the GraphQL interface to access this table. We haven't used this `generate` command yet (although the `scaffold` command did use it behind the scenes):

```bash
yarn rw g sdl Contact
```

Just like the `scaffold` command, this will create two new files under the `api` directory:

1. `api/src/graphql/contacts.sdl.js`: defines the GraphQL schema in GraphQL's schema definition language
2. `api/src/services/contacts/contacts.js`: contains your app's business logic (also creates associated test files)

If you remember our discussion in [how Redwood works with data](/docs/tutorial/side-quest-how-redwood-works-with-data) you'll recall that queries and mutations in an SDL file are automatically mapped to resolvers defined in a service, so when you generate an SDL file you'll get a service file as well, since one requires the other.

Open up `api/src/graphql/contacts.sdl.js` and you'll see the `Contact`, `CreateContactInput` and `UpdateContactInput` types were already defined for us—the `generate sdl` command introspected the schema and created a `Contact` type containing each database field in the table, as well as a `Query` type with a single query `contacts` which returns an array of `Contact` types.

```javascript
// api/src/graphql/contacts.sdl.js

export const schema = gql`
  type Contact {
    id: Int!
    name: String!
    email: String!
    message: String!
    createdAt: DateTime!
  }

  type Query {
    contacts: [Contact!]! @requireAuth
  }

  input CreateContactInput {
    name: String!
    email: String!
    message: String!
  }

  input UpdateContactInput {
    name: String
    email: String
    message: String
  }
`
```

The `@requireAuth` string is a [schema directive](https://www.graphql-tools.com/docs/schema-directives) which says that in order to access this GraphQL query the user is required to be authenticated. We haven't added authentication yet, so this won't have any effect—anyone will be able to query it, logged in or not, because until you add authentication the function behind `@requireAuth` always returns `true`.

What's `CreateContactInput` and `UpdateContactInput`? Redwood follows the GraphQL recommendation of using [Input Types](https://graphql.org/graphql-js/mutations-and-input-types/) in mutations rather than listing out each and every field that can be set. Any fields required in `schema.prisma` are also required in `CreateContactInput` (you can't create a valid record without them) but nothing is explicitly required in `UpdateContactInput`. This is because you could want to update only a single field, or two fields, or all fields. The alternative would be to create separate Input types for every permutation of fields you would want to update. We felt that only having one update input type was a good compromise for optimal developer experience.

> Redwood assumes your code won't try to set a value on any field named `id` or `createdAt` so it left those out of the Input types, but if your database allowed either of those to be set manually you can update `CreateContactInput` or `UpdateContactInput` and add them.

Since all of the DB columns were required in the `schema.prisma` file they are marked as required in the GraphQL Types with the `!` suffix on the datatype (e.g. `name: String!`).

> **GraphQL syntax for required fields**
>
> GraphQL's SDL syntax requires an extra `!` when a field _is_ required. Remember: `schema.prisma` syntax requires an extra `?` character when a field is _not_ required.

As described in [Side Quest: How Redwood Deals with Data](side-quest-how-redwood-works-with-data), there are no explicit resolvers defined in the SDL file. Redwood follows a simple naming convention: each field listed in the `Query` and `Mutation` types in the `sdl` file (`api/src/graphql/contacts.sdl.js`) maps to a function with the same name in the `services` file (`api/src/services/contacts/contacts.js`).

So the default SDL that's created by the generators is effectively read-only: there is no way to create or update an existing record. Which means we'll need to add our own create functionality.

> *Psssstttt* I'll let you in on a little secret: you can have Redwood create all the operators you need to perform CRUD (Create, Retrieve, Update, Delete) functions against your data automatically! But that wouldn't teach you anything, so we're doing it the hard way here. The next time you generate an SDL, try adding the `--crud` flag:
>
>    `yarn rw g sdl Contact --crud`
>
> Shhhhhhhhh...

In this case we're creating a single `Mutation` that we'll call `createContact`. Add that to the end of the SDL file (before the closing backtick):

```javascript {28-30}
// api/src/graphql/contacts.sdl.js

export const schema = gql`
  type Contact {
    id: Int!
    name: String!
    email: String!
    message: String!
    createdAt: DateTime!
  }

  type Query {
    contacts: [Contact!]! @requireAuth
  }

  input CreateContactInput {
    name: String!
    email: String!
    message: String!
  }

  input UpdateContactInput {
    name: String
    email: String
    message: String
  }

  type Mutation {
    createContact(input: CreateContactInput!): Contact @skipAuth
  }
`
```

The `createContact` mutation will accept a single variable, `input`, that is an object that conforms to what we expect for a `CreateContactInput`, namely `{ name, email, message }`. We've also added on a new directive: `@skipAuth`. This one says that authentication is *not* required and will allow anyone to anonymously send us a message. Note that having at least one schema directive is required for each `Query` and `Mutation` or you'll get an error: Redwood embraces the idea of "secure by default" meaning that we try and keep your application safe, even if you do nothing special to prevent access. In this case it's much safer to throw an error than to accidentally expose all of your users' data to the internet!

> Serendipitously, the default schema directive of `@requireAuth` is exactly what we want for the `contacts` query that returns ALL contacts—only we, the owners of the blog, should have access to read them all.

That's it for the SDL file, let's define the service that will actually save the data to the database. The service includes a default `contacts` function for getting all contacts from the database. Let's add our mutation to create a new one:

```javascript {9-11}
// api/src/services/contacts/contacts.js

import { db } from 'src/lib/db'

export const contacts = () => {
  return db.contact.findMany()
}

export const createContact = ({ input }) => {
  return db.contact.create({ data: input })
}
```

Before we plug this into the UI, let's take a look at a nifty GUI you get just by running `yarn redwood dev`.

### GraphQL Playground

Often it's nice to experiment and call your API in a more "raw" form before you get too far down the path of implementation only to find out something is missing. Is there a typo in the API layer or the web layer? Let's find out by accessing just the API layer.

When you started development with `yarn redwood dev` (or `yarn rw dev`) you actually started a second process running at the same time. Open a new browser tab and head to [http://localhost:8911/graphql](http://localhost:8911/graphql) This is Apollo Server's [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/), a web-based GUI for GraphQL APIs:

<img src="https://user-images.githubusercontent.com/300/70950852-9b97af00-2016-11ea-9550-b6983ce664e2.png" />

Not very exciting yet, but check out that "Docs" tab on the far right:

<img src="https://user-images.githubusercontent.com/300/73311311-fce89b80-41da-11ea-9a7f-2ef6b8191052.png" />

It's the complete schema as defined by our SDL files! The Playground will ingest these definitions and give you autocomplete hints on the left to help you build queries from scratch. Try getting the IDs of all the posts in the database; type the query at the left and then click the "Play" button to execute:

<img src="https://user-images.githubusercontent.com/300/70951466-52e0f580-2018-11ea-91d6-5a5712858781.png" />

The GraphQL Playground is a great way to experiment with your API or troubleshoot when you come across a query or mutation that isn't behaving in the way you expect.

### Creating a Contact

Our GraphQL mutation is ready to go on the backend so all that's left is to invoke it on the frontend. Everything related to our form is in `ContactPage` so that's where we'll put the mutation call. First we define the mutation as a constant that we call later (this can be defined outside of the component itself, right after the `import` statements):

```javascript {13-19}
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

We reference the `createContact` mutation we defined in the Contacts SDL passing it an `input` object which will contain the actual name, email and message values.

Next we'll call the `useMutation` hook provided by Redwood which will allow us to execute the mutation when we're ready (don't forget the `import` statement):

```javascript {12,23}
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const [create] = useMutation(CREATE_CONTACT)

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

`create` is a function that invokes the mutation and takes an object with a `variables` key, containing another object with an `input` key. As an example, we could call it like:

```javascript
create({
  variables: {
    input: {
      name: 'Rob',
      email: 'rob@redwoodjs.com',
      message: 'I love Redwood!',
    },
  },
})
```

If you'll recall `<Form>` gives us all of the fields in a nice object where the key is the name of the field, which means the `data` object we're receiving in `onSubmit` is already in the proper format that we need for the `input`!

That means we can update the `onSubmit` function to invoke the mutation with the data it receives:

```javascript {26}
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const [create] = useMutation(CREATE_CONTACT)

  const onSubmit = (data) => {
    create({ variables: { input: data } })
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

Try filling out the form and submitting—you should have a new Contact in the database! You can verify that with [Prisma Studio](/docs/tutorial/getting-dynamic#prisma-studio) or [GraphQL Playground](#graphql-playground) if you were so inclined:

![image](https://user-images.githubusercontent.com/300/76250632-ed5d6900-6202-11ea-94ce-bd88e3a11ade.png)

> **Wait, I thought you said this was secure by default and someone couldn't view all contacts without being logged in?**
>
> Remember: we haven't added authentication yet, so the concept of someone being logged in is meaningless right now. In order to prevent frustrating errors in a new application, the `@requireAuth` directive simply returns `true` until you setup an authentication system. At that point the directive will use real logic for determining if the user is logged in or not and behave accordingly.

### Improving the Contact Form

Our contact form works but it has a couple of issues at the moment:

* Clicking the submit button multiple times will result in multiple submits
* The user has no idea if their submission was successful
* If an error was to occur on the server, we have no way of notifying the user

Let's address these issues.

#### Disable Save on Loading

The `useMutation` hook returns a couple more elements along with the function to invoke it. We can destructure these as the second element in the array that's returned. The two we care about are `loading` and `error`:

```javascript {6}
// web/src/pages/ContactPage/ContactPage.js

// ...

const ContactPage = () => {
  const [create, { loading, error }] = useMutation(CREATE_CONTACT)

  const onSubmit = (data) => {
    create({ variables: { input: data } })
    console.log(data)
  }

  return (...)
}

// ...
```

Now we know if the database call is still in progress by looking at `loading`. An easy fix for our multiple submit issue would be to disable the submit button if the response is still in progress. We can set the `disabled` attribute on the "Save" button to the value of `loading`:

```javascript {5}
// web/src/pages/ContactPage/ContactPage.js

return (
  // ...
  <Submit disabled={loading}>Save</Submit>
  // ...
)
```

It may be hard to see a difference in development because the submit is so fast, but you could enable network throttling via the Network tab Chrome's Web Inspector to simulate a slow connection:

<img src="https://user-images.githubusercontent.com/300/71037869-6dc56f80-20d5-11ea-8b26-3dadb8a1ed86.png" />

You'll see that the "Save" button become disabled for a second or two while waiting for the response.

#### Notification on Save

Next, let's show a notification to let the user know their submission was successful. Redwood includes [react-hot-toast](https://react-hot-toast.com/) to quickly show a popup notification on a page.

`useMutation` accepts an options object as a second argument. One of the options is a callback function, `onCompleted`, that will be invoked when the mutation successfully completes. We'll use that callback to invoke a `toast()` function which will add a message to be displayed in a **&lt;Toaster&gt;** component.

Add the `onCompleted` callback to `useMutation` and include the **&lt;Toaster&gt;** component in our `return`, just before the **&lt;Form&gt;**:

```javascript {13,24-28,38}
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const [create, { loading, error }] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Thank you for your submission!')
    },
  })

  const onSubmit = (data) => {
    create({ variables: { input: data } })
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Toaster />
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

![Toast notification on successful submission](https://user-images.githubusercontent.com/300/146271487-f6b77e76-99c1-43e8-bcda-5ba3c9b03137.png)

You can read the full documentation for Toast [here](https://redwoodjs.com/docs/toast-notifications).

### Displaying Server Errors

Next we'll inform the user of any server errors. So far we've only notified the user of _client_ errors: a field was missing or formatted incorrectly. But if we have server-side constraints in place `<Form>` can't know about those, but we still need to let the user know something went wrong.

We have email validation on the client, but any developer worth their silicon knows [never trust the client](https://www.codebyamir.com/blog/never-trust-data-from-the-browser). Let's add the email validation into the api side as well to be sure no bad data gets into our database, even if someone somehow bypassed our client-side validation (l33t hackers do this all the time).

> **No server-side validation for some fields?**
>
> Why don't we need server-side validation for the existence of name, email and message? Because GraphQL is already doing that for us! You may remember the `String!` declaration in our SDL file for the `Contact` type: that adds a constraint that those fields cannot be `null` as soon as it arrives on the api side. If it is, GraphQL would reject the request and throw an error back to us on the client.
>
> We've even got another layer of validation: because name, email and message were set as required in our schema.prisma file, the database itself will prevent any `null`s from being recorded. It's like if you decided to run out onto the field in the middle of a sporting even wearing your favorite [Redwood t-shirt](https://shop.redwoodjs.com/): even if you somehow made it past the security guard (GraphQL), once you get out there you're going to have to deal with actual professional athletes (the database). They've spent their whole life training to run faster and pick up heavier things than you. You won't make it very far if they decide to stop you!

We talked about business logic belonging in our services files and this is a perfect example. Let's add a `validate` function to our `contacts` service:

```javascript {3,7-15,22}
// api/src/services/contacts/contacts.js

import { UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

const validate = (input) => {
  if (input.email && !input.email.match(/[^@]+@[^.]+\..+/)) {
    throw new UserInputError("Can't create new contact", {
      messages: {
        email: ['is not formatted like an email address'],
      },
    })
  }
}

export const contacts = () => {
  return db.contact.findMany()
}

export const createContact = ({ input }) => {
  validate(input)
  return db.contact.create({ data: input })
}
```

So when `createContact` is called it will first validate the inputs and only if no errors are thrown will it continue to actually create the record in the database.

We already capture any existing error in the `error` constant that we got from `useMutation`, so we _could_ manually display an error box on the page somewhere containing those errors, maybe at the top of the form (you can put this in your contact form, but we're about to change it to something even better):

```jsx {2-7}
<Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
  {error && (
    <div style={{ color: 'red' }}>
      {"We couldn't send your message: "}
      {error.message}
    </div>
  )}
  // ...
```

To get a server error to fire, let's remove the email format validation so that the client-side error isn't shown:

```html
// web/src/pages/ContactPage/ContactPage.js

<TextField
  name="email"
  validation={{
    required: true,
  }}
  errorClassName="error"
/>
```

If you made the change above and then try to fill out the form with an invalid email address:

<img src="https://user-images.githubusercontent.com/300/146272057-0651d028-ddde-4229-b978-4de26643d30d.png" />

It ain't pretty, but it works. It would be nice if the field itself was highlighted like it was when the inline validation was in place...

Remember when we said that `<Form>` had one more trick up its sleeve? Here it comes!

Remove the inline error display (if you added it, the block starting with `{ error && ...}`) and replace it with `<FormError>`, passing the `error` constant we got from `useMutation` and a little bit of styling to `wrapperStyle` (don't forget the `import`). We'll also pass `error` to `<Form>` so it can setup a context:

```javascript {7,40-44}
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  FormError,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const [create, { loading, error }] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Thank you for your submission!')
    },
  })

  const onSubmit = (data) => {
    create({ variables: { input: data } })
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Toaster toastOptions={{ duration: 100000 }} />
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }} error={error}>
        <FormError
          error={error}
          wrapperClassName="form-error"
        />

        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

Now submit a message with an invalid email address:

<img src="https://user-images.githubusercontent.com/300/146273310-c065a3ee-af2a-434c-987b-0f6126c13021.png" />

We get that error message at the top saying something went wrong in plain English _and_ the actual field is highlighted for us, just like the inline validation! The message at the top may be overkill for such a short form, but it can be key if a form is multiple screens long; the user gets a summary of what went wrong all in one place and they don't have to resort to hunting through a long form looking for red boxes. You don't have to use that message box at the top, though; just remove `<FormError>` and the field will still be highlighted as expected.

The fact that the error message was also attached to the form field is enabled by the format of the error that we threw in the Contacts service:

```javascript
throw new UserInputError("Can't create new contact", {
  messages: {
    email: ['is not formatted like an email address'],
  },
})
```

That second argument is an object with a key, `messages`, that points to another object with keys the same as the `name` of the input/label and values that are an array of strings containing the actual error message. All of these are also combined into the content of `<FormError>`.

> **`<FormError>` styling options**
>
> `<FormError>` has several styling options which are attached to different parts of the message:
>
> - `wrapperStyle` / `wrapperClassName`: the container for the entire message
> - `titleStyle` / `titleClassName`: the "Can't create new contact" title
> - `listStyle` / `listClassName`: the `<ul>` that contains the list of errors
> - `listItemStyle` / `listItemClassName`: each individual `<li>` around each error

### One more thing...

Since we're not redirecting after the form submits, we should at least clear out the form fields. This requires we get access to a `reset()` function that's part of [React Hook Form](https://react-hook-form.com/), but we don't have access to it with the basic usage of `<Form>` (like we're currently using).

Redwood includes a hook called `useForm()` (from React Hook Form) which is normally called for us within `<Form>`. In order to reset the form we need to invoke that hook ourselves. But the functionality that `useForm()` provides still needs to be used in `Form`. Here's how we do that.

First we'll import `useForm`:

```javascript {11}
// web/src/pages/ContactPage/ContactPage.js

import {
  FieldError,
  Form,
  FormError,
  Label,
  TextField,
  TextAreaField,
  Submit,
  useForm,
} from '@redwoodjs/forms'
```

And now call it inside of our component:

```javascript {4}
// web/src/pages/ContactPage/ContactPage.js

const ContactPage = () => {
  const formMethods = useForm()
  //...
```

Finally we'll tell `<Form>` to use the `formMethods` we just got from `useForm()` instead of doing it itself:

```javascript {10}
// web/src/pages/ContactPage/ContactPage.js

return (
  <>
    <Toaster />
    <Form
      onSubmit={onSubmit}
      config={{ mode: 'onBlur' }}
      error={error}
      formMethods={formMethods}
    >
    // ...
```

Now we can call `reset()` on `formMethods` after we call `toast()`:

```javascript {8}
// web/src/pages/ContactPage/ContactPage.js

// ...

const [create, { loading, error }] = useMutation(CREATE_CONTACT, {
  onCompleted: () => {
    toast.success('Thank you for your submission!')
    formMethods.reset()
  },
})

// ...
```

> You can put the email validation back into the `<TextField>` now, but you should leave the server validation in place, just in case.

Here's the entire page:

```javascript
// web/src/pages/ContactPage/ContactPage.js

import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  FormError,
  Label,
  TextField,
  TextAreaField,
  Submit,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const formMethods = useForm()

  const [create, { loading, error }] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Thank you for your submission!')
      formMethods.reset()
    },
  })

  const onSubmit = (data) => {
    create({ variables: { input: data } })
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <Toaster toastOptions={{ duration: 100000 }} />
      <Form
        onSubmit={onSubmit}
        config={{ mode: 'onBlur' }}
        error={error}
        formMethods={formMethods}
      >
        <FormError error={error} wrapperClassName="form-error" />

        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
```

That's it! [React Hook Form](https://react-hook-form.com/) provides a bunch of [functionality](https://react-hook-form.com/api) that `<Form>` doesn't expose. When you want to get to that functionality you can call `useForm()` yourself, but make sure to pass the returned object (we called it `formMethods`) as a prop to `<Form>` so that the validation and other functionality keeps working.

> You may have noticed that the onBlur form config stopped working once you started calling `useForm()` yourself. That's because Redwood calls `useForm()` behind the scenes and automatically passes it the `config` prop that you gave to `<Form>`. Redwood is no longer calling `useForm()` for you so if you need some options passed you need to do it manually:
>
> ```javascript
> // web/src/pages/ContactPage/ContactPage.js
>
> const ContactPage = () => {
>  const formMethods = useForm({ mode: 'onBlur' })
>   //...
> ```

The public site is looking pretty good. How about the administrative features that let us create and edit posts? We should move them to some kind of admin section and put them behind a login so that random users poking around at URLs can't create ads for discount pharmaceuticals.
