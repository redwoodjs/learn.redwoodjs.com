---
id: authentication
title: "Authentication"
sidebar_label: "Authentication"
---

"Authentication" is a blanket term for all of the stuff that goes into making sure that a user, often identified with an email address and password, is allowed to access something. Authentication can be [famously fickle](https://www.rdegges.com/2017/authentication-still-sucks/) to do right both from a technical standpoint and developer happiness standpoint.

But you know Redwood has your back! Login isn't something we have to write from scratch—it's a solved problem and is one less thing we should have to worry about. Today Redwood includes integrations to:

- [Auth0](https://auth0.com/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

We're going to demo a Netlify Identity integration in this tutorial since we're already deployed there and it's very easy to add to a Netlify site.

> **Authentication vs. Authorization**
> 
> There are two terms which contain a lot of letters, starting with an "A" and ending in "ation" (which means you could rhyme them if you wanted to) that become involved in most discussions about login:
> 
> - Authentication
> - Authorization
> 
> Here is how Redwood uses these terms:
> 
> - **Authentication** deals with determining whether someone is who they say they are, generally by "logging in" with an email and password, or a third party OAuth provider like Google.
> - **Authorization** is whether a user (who has usually already been authenticated) is allowed to do something they want to do. This generally involves some combination of roles and permission checking before allowing access to a URL or feature of your site.
> 
> This section of the tutorial focuses on **Authentication** only. We're currently working on integrating a simple and flexible role-based authorization system and once we release it we'll update the tutorial to include a walkthrough!

### Netlify Identity Setup

Assuming you've been following along, you already have a Netlify account and a site set up. If you'd be so kind, head to the **Identity** tab and click the **Enable Identity** button:

![Netlify Identity screenshot](https://user-images.githubusercontent.com/300/82271191-f5850380-992b-11ea-8061-cb5f601fa50f.png)

When the screen refreshes click the **Invite users** button and enter a real email address (they're going to send a confirmation link to it):

![Netlify invite user screenshot](https://user-images.githubusercontent.com/300/82271302-439a0700-992c-11ea-9d6d-004adef3a385.png)

We'll need to get that email confirmation link soon, but for now let's set up our app for authentication.

### Authentication Generation

There are a couple of places we need to add some code for authentication and lucky for us Redwood can do it automatically with a generator:

```terminal
yarn rw g auth netlify
```

The generator adds one file and modifies a couple others.

> **Are you on the latest Redwood?**
> 
> For this to work you must be on version `0.7.0` or greater of Redwood. If you don't see any file changes, try [upgrading](https://redwoodjs.com/docs/cli-commands#upgrade) your Redwood packages with `yarn rw upgrade`.

Take a look at the newly created `api/src/lib/auth.js` (usage comments omitted):

```javascript
// api/src/lib/auth.js

import { AuthenticationError } from "@redwoodjs/api";

export const getCurrentUser = async (decoded, { token, type }) => {
    return decoded;
};

export const requireAuth = () => {
    if (!context.currentUser) {
        throw new AuthenticationError("You don't have permission to do that.");
    }
};
```

By default the authentication system will return only the data that the third-party auth handler knows about (that's what's inside the `jwt` object above). For Netlify Identity that's an email address, an optional name and optional array of roles. Usually you'll have your own concept of a user in your local database. You can modify `getCurrentUser` to return that user, rather than the details that the auth system stores. The comments at the top of the file give one example of how you could look up a user based on their email address. We also provide a simple implementation for requiring that a user be authenticated when trying to access a service: `requireAuth()`. It will throw an error that GraphQL knows what to do with if a non-authenticated person tries to get to something they shouldn't.

The files that were modified by the generator are:

- `web/src/index.js`—wraps the router in `<AuthProvider>` which makes the routes themselves authentication aware, and gives us access to a `useAuth()` hook that returns several functions for logging users in and out, checking their current logged-inness, and more.
- `api/src/functions/graphql.js`—makes `currentUser` available to the api side so that you can check whether a user is allowed to do something on the backend. If you add an implementation to `getCurrentUser()` in `api/src/lib/auth.js` then that is what will be returned by `currentUser`, otherwise it will return just the details the auth system has for the user. If they're not logged in at all then `currentUser` will be `null`.

We'll hook up both the web and api sides below to make sure a user is only doing things they're allowed to do.

### API Authentication

First let's lock down the API so we can be sure that only authorized users can create, update and delete a Post. Open up the Post service and let's add a check:

```javascript {4,17,24,32}
// api/src/services/posts/posts.js

import { db } from "src/lib/db";
import { requireAuth } from "src/lib/auth";

export const posts = () => {
    return db.post.findMany();
};

export const post = ({ id }) => {
    return db.post.findOne({
        where: { id },
    });
};

export const createPost = ({ input }) => {
    requireAuth();
    return db.post.create({
        data: input,
    });
};

export const updatePost = ({ id, input }) => {
    requireAuth();
    return db.post.update({
        data: input,
        where: { id },
    });
};

export const deletePost = ({ id }) => {
    requireAuth();
    return db.post.delete({
        where: { id },
    });
};

export const Post = {
    user: (_obj, { root }) => db.post.findOne({ where: { id: root.id } }).user(),
};
```

Now try creating, editing or deleting a post from our admin pages. Nothing happens! Should we show some kind of friendly error message? In this case, probably not—we're going to lock down the admin pages altogether so they won't be accessible by a browser. The only way someone would be able to trigger these errors in the API is if they tried to access the GraphQL endpoint directly, without going through our UI. The API is already returning an error message (open the Web Inspector in your browser and try that create/edit/delete again) so we are covered.

> **Services as Containers for Your Business Logic**
> 
> Note that we're putting the authentication checks in the service and not checking in the GraphQL interface (in the SDL files). Redwood created the concept of **services** as containers for your business logic which can be used by other parts of your application besides the GraphQL API.
> 
> By putting authentication checks here you can be sure that any other code that tries to create/update/delete a post will fall under the same authentication checks. In fact, Apollo (the GraphQL library Redwood uses) [agrees with us](https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-in-data-models)!

### Web Authentication

Now we'll restrict access to the admin pages completely unless you're logged in. The first step will be to denote which routes will require that you be logged in. Enter the `<Private>` tag:

```javascript {3,12,16}
// web/src/Routes.js

import { Router, Route, Private } from "@redwoodjs/router";

const Routes = () => {
    return (
        <Router>
            <Route path="/contact" page={ContactPage} name="contact" />
            <Route path="/about" page={AboutPage} name="about" />
            <Route path="/" page={HomePage} name="home" />
            <Route path="/blog-post/{id:Int}" page={BlogPostPage} name="blogPost" />
            <Private unauthenticated="home">
                <Route path="/admin/posts/new" page={NewPostPage} name="newPost" />
                <Route path="/admin/posts/{id:Int}/edit" page={EditPostPage} name="editPost" />
                <Route path="/admin/posts/{id:Int}" page={PostPage} name="post" />
                <Route path="/admin/posts" page={PostsPage} name="posts" />
            </Private>
            <Route notfound page={NotFoundPage} />
        </Router>
    );
};

export default Routes;
```

Surround the routes you want to be behind authentication and optionally add the `unauthenticated` attribute that lists the name of another route to redirect to if the user is not logged in. In this case we'll go back to the homepage.

Try that in your browser. If you hit http://localhost:8910/admin/posts you should immediately go back to the homepage.

Now all that's left to do is let the user actually log in! If you've built authentication before then you know this part is usually a drag, but Redwood makes it a walk in the park. Most of the plumbing was handled by the auth generator, so we get to focus on the parts the user actually sees. First, let's add a **Login** link that will trigger a modal from the [Netlify Identity widget](https://github.com/netlify/netlify-identity-widget). Let's assume we want this on all of the public pages, so we'll put it in the `BlogLayout`:

```javascript {4,7,22-26}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from "@redwoodjs/router";
import { useAuth } from "@redwoodjs/auth";

const BlogLayout = ({ children }) => {
    const { logIn } = useAuth();

    return (
        <div>
            <h1>
                <Link to={routes.home()}>Redwood Blog</Link>
            </h1>
            <nav>
                <ul>
                    <li>
                        <Link to={routes.about()}>About</Link>
                    </li>
                    <li>
                        <Link to={routes.contact()}>Contact</Link>
                    </li>
                    <li>
                        <button onClick={logIn}>Log In</button>
                    </li>
                </ul>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default BlogLayout;
```

Try clicking the login link:

![Netlify Identity Widget modal](https://user-images.githubusercontent.com/300/82387730-aa7ef500-99ec-11ea-9a40-b52b383f99f0.png)

We need to let the widget know the URL of our site so it knows where to go to get user data and confirm they're able to log in. Back over to Netlify, you can get that from the Identity tab:

![Netlify site URL](https://user-images.githubusercontent.com/300/82387937-28430080-99ed-11ea-91b7-a4e10f14aa83.png)

You need the protocol and domain, not the rest of the path. Paste that into the modal and click that **Set site's URL** button. The modal should reload and now show a real login box:

![Netlify identity widget login](https://user-images.githubusercontent.com/300/82388116-97205980-99ed-11ea-8fb4-13436ee8e746.png)

#### Accepting Invites

Before we can log in, remember that confirmation email from Netlify? Go find that and click the **Accept the invite** link. That will bring you to your site live in production, where nothing will happen. But if you look at the URL it will end in something like `#invite_token=6gFSXhugtHCXO5Whlc5V`. Copy that (including the `#`) and appened it to your localhost URL: http://localhost:8910/#invite_token=6gFSXhugtHCXO5Whlc5Vg Hit Enter, then go back into the URL and hit Enter again to get it to actually reload the page. Now the modal will show **Complete your signup** and give you the ability to set your password:

![Netlify identity set password](https://user-images.githubusercontent.com/300/82388369-54ab4c80-99ee-11ea-920e-9df10ee0cac2.png)

Once you do that the modal should update and say that you're logged in! It worked! Click the X in the upper right to close the modal.

> We know that invite acceptance flow is less than ideal. The good news is that once you deploy your site again with authentication, future invites will work automatically—the link will go to production which will now have the code needed to launch the modal and let you accept the invite.

We've got no indication on our actual site that we're logged in, however. How about changing the **Log In** button to be **Log Out** when you're authenticated:

```javascript {7,23-24}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from "@redwoodjs/router";
import { useAuth } from "@redwoodjs/auth";

const BlogLayout = ({ children }) => {
    const { logIn, logOut, isAuthenticated } = useAuth();

    return (
        <div>
            <h1>
                <Link to={routes.home()}>Redwood Blog</Link>
            </h1>
            <nav>
                <ul>
                    <li>
                        <Link to={routes.about()}>About</Link>
                    </li>
                    <li>
                        <Link to={routes.contact()}>Contact</Link>
                    </li>
                    <li>
                        <button onClick={isAuthenticated ? logOut : logIn}>{isAuthenticated ? "Log Out" : "Log In"}</button>
                    </li>
                </ul>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default BlogLayout;
```

`useAuth()` provides a couple more helpers for us, in this case `isAuthenticated` which will return `true` or `false` based on your login status, and `logOut()` which will log the user out. Now clicking **Log Out** should log you out and change the link to **Log In** which you can click to open the modal and log back in again.

When you _are_ logged in, you should be able to access the admin pages again: http://localhost:8910/admin/posts

> If you start working on another Redwood app that uses Netlify Identity you'll need to manually clear out your Local Storage which is where the site URL is stored that you entered the first time you saw the modal. Local Storage is tied to your domain and port, which by default will be the same for any Redwood app when developing locally. You can clear your Local Storage in Chrome by going to the Web Inspector, the **Application** tab, and then on the left open up **Local Storage** and click on http://localhost:8910. You'll see the keys stored on the right and can delete them all.

One more touch: let's show the email address of the user that's logged in. We can get the `currentUser` from `useAuth()` and it will contain the data that our third party authentication library is storing about the currently logged in user:

```javascript {7,27}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from "@redwoodjs/router";
import { useAuth } from "@redwoodjs/auth";

const BlogLayout = ({ children }) => {
    const { logIn, logOut, isAuthenticated, currentUser } = useAuth();

    return (
        <div>
            <h1>
                <Link to={routes.home()}>Redwood Blog</Link>
            </h1>
            <nav>
                <ul>
                    <li>
                        <Link to={routes.about()}>About</Link>
                    </li>
                    <li>
                        <Link to={routes.contact()}>Contact</Link>
                    </li>
                    <li>
                        <button onClick={isAuthenticated ? logOut : logIn}>{isAuthenticated ? "Log Out" : "Log In"}</button>
                    </li>
                    {isAuthenticated && <li>{currentUser.email}</li>}
                </ul>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default BlogLayout;
```

![Logged in email](https://user-images.githubusercontent.com/300/82389433-05b2e680-99f1-11ea-9d01-456cad508c80.png)

> **More on Netlify Identity**
> 
> Check out the settings (or [docs](https://docs.netlify.com/visitor-access/identity/)) for Identity over at Netlify for more options, including allowing users to create accounts rather than having to be invited, add third party login buttons for Bitbucket, GitHub, GitLab and Google, receive webhooks when someone logs in, and more!

Believe it or not, that's it! Authentication with Redwood is a breeze and we're just getting started. Expect more magic soon!

> If you inspect the contents of `currentUser` you'll see it contains an array called `roles`. On the Netlify Identity dashboard you can give your user a collection of roles, which are just strings like "admin" or "guest". Using this array of roles you _could_ create a very rudimentary role-based authentication system. Unless you are in dire need of this simple role checking, we recommend waiting for the Redwood solution, coming soon!
