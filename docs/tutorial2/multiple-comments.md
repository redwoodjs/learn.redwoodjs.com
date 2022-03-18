---
id: multiple-comments
title: "Multiple Comments"
sidebar_label: "Multiple Comments"
---

Our amazing blog posts will obviously garner a huge and passionate fanbase and we will very rarely have only a single comment. Let's work on displaying a list of comments.

Let's think about where our comments are being displayed. Probably not on the homepage, since that only shows a summary of each post. A user would need to go to the full page to show the comments for that blog post. But that page is only fetching the data for the single blog post itself, nothing else. We'll need to get the comments and since we'll be fetching *and* displaying them, that sounds like a job for a Cell.

> **Couldn't the query for the blog post page also fetch the comments?**
>
> Yes, it could! But the idea behind Cells is to make components even more [composable](https://en.wikipedia.org/wiki/Composability) by having them be responsible for their own data fetching *and* display. If we rely on a blog post to fetch the comments then the new Comments component we're about to create now requires something *else* to fetch the comments and pass them in. If we re-use the Comments component somewhere, now we're fetching comments in two different places.
>
> **But what about the Comment component we just made, why doesn't that fetch its own data?**
>
> There aren't any instances I (the author) could think of where we would ever want to display only a single comment in isolation—it would always be a list of all comments on a post. If displaying a single comment was common for your use case then it could definitely be converted to a **CommentCell** and have it responsible for pulling the data for that single comment itself. But keep in mind that if you have 50 comments on a blog post, that's now 50 GraphQL calls that need to go out, one for each comment. There's always a trade-off!
>
> **Then why make a standalone Comment component at all? Why not just do all the display in the CommentsCell?**
>
> We're trying to start in small chunks to make the tutorial more digestible for a new audience so we're starting simple and getting more complex as we go. But it also just feels *nice* to build up a UI from these smaller chunks that are easier to reason about and keep separate in your head.
>
> **But what about—**
>
> Look, we gotta end this sidebar and get back to building this thing. You can ask more questions later, promise!

### Storybook

Let's generate a **CommentsCell**:

```bash
yarn rw g cell Comments
```

Storybook updates with a new **CommentsCell** under the **Cells** folder, and it's actually showing something:

![image](https://user-images.githubusercontent.com/300/153477642-0d5a15a5-f96f-485a-b8b0-dbc1c4515279.png)

Where did that come from? Check out `CommentsCell.mock.js`: there's no Prisma model for a Comment yet, so Redwood took a guess that your model would at least contain an `id` field and just used that for the mock data.

Let's update the `Success` component to use the `Comment` component created earlier, and add all of the fields we'll need for the **Comment** to render to the `QUERY`:

```javascript {3,9-11,25-27}
// web/src/components/CommentsCell/CommentsCell.js

import Comment from 'src/components/Comment'

export const QUERY = gql`
  query CommentsQuery {
    comments {
      id
      name
      body
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ comments }) => {
  return comments.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  ))
}
```

We're passing an additional `key` prop to make React happy when iterating over an array with `map`.

If you check Storybook, you'll see that we do indeed render the `Comment` component three times, but there's no data to display. Let's update the mock with some sample data:

```javascript {4-17}
// web/src/components/CommentsCell/CommentsCell.mock.js

export const standard = () => ({
  comments: [
    {
      id: 1,
      name: 'Rob Cameron',
      body: 'First comment',
      createdAt: '2020-01-02T12:34:56Z',
    },
    {
      id: 2,
      name: 'David Price',
      body: 'Second comment',
      createdAt: '2020-02-03T23:00:00Z',
    },
  ],
})
```

> What's this `standard` thing? Think of it as the standard, default mock if you don't do anything else. We would have loved to use the name "default" but that's already a reserved word in Javascript!

Storybook refreshes and we've got comments! It's a little hard to distinguish between the two separate comments because they're right next to each other:

![image](https://user-images.githubusercontent.com/300/153478670-14c32c29-6d1d-491b-bc2b-b033557a6d84.png)

Since `CommentsCell` is the one responsible for drawing multiple comments, it makes sense that it should be "in charge" of how they're displayed, including the gap between them. Let's add a style to do that in `CommentsCell`:

```javascript {5,9}
// web/src/components/CommentsCell/CommentsCell.js

export const Success = ({ comments }) => {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  )
}
```

> `space-y-8` is a handy Tailwind class that puts a space *between* elements, but not above or below the entire stack (which is what would happen if you gave each `<Comment>` its own top/bottom margin).

Looking good! Let's add our CommentsCell to the actual blog post display page:

```javascript {4,21}
// web/src/components/Article/Article.js

import { Link, routes } from '@redwoodjs/router'
import CommentsCell from 'src/components/CommentsCell'

const truncate = (text, length) => {
  return text.substring(0, length) + '...'
}

const Article = ({ article, summary = false }) => {
  return (
    <article>
      <header>
        <h2 className="text-xl text-blue-700 font-semibold">
          <Link to={routes.article({ id: article.id })}>{article.title}</Link>
        </h2>
      </header>
      <div className="mt-2 text-gray-900 font-light">
        {summary ? truncate(article.body, 100) : article.body}
      </div>
      {!summary && <CommentsCell />}
    </article>
  )
}

export default Article
```

If we are *not* showing the summary, then we'll show the comments. Take a look at the **Full** and **Summary** stories in Storybook and you should see comments on one and not on the other.

> **Shouldn't the CommentsCell cause an actual GraphQL request? How does this work?**
>
> Redwood has added some functionality around Storybook so that if you're testing a component that itself isn't a Cell (like the `Article` component) but that renders a cell (like `CommentsCell`), then it will mock the GraphQL and use the `standard` mock that goes along with that Cell. Pretty cool, huh?

Adding the comments to the article display has exposed another design issue: the comments are sitting right up underneath the article text:

![image](https://user-images.githubusercontent.com/300/153480229-ea483d75-62bf-4b56-b248-10ca1597a7a8.png)

Let's add a gap between the two:

```javascript {15-17}
// web/src/components/BlogPost/BlogPost.js

const BlogPost = ({ post, summary = false }) => {
  return (
    <article className="mt-10">
      <header>
        <h2 className="text-xl text-blue-700 font-semibold">
          <Link to={routes.blogPost({ id: post.id })}>{post.title}</Link>
        </h2>
      </header>
      <div className="mt-2 text-gray-900 font-light">
        {summary ? truncate(post.body, 100) : post.body}
      </div>
      {!summary && (
        <div className="mt-12">
          <CommentsCell />
        </div>
      )}
    </article>
  )
}
```

![image](https://user-images.githubusercontent.com/300/153480489-a59f27e3-6d70-4548-9a1e-4036b6860444.png)

Okay, comment display is looking good! However, you may have noticed that if you tried going to the actual site there's an error where the comments should be:

![image](https://user-images.githubusercontent.com/300/153480635-58ada8e8-ed5b-41b6-875b-501a07a36d9a.png)

Why is that? Remember that we started with the `CommentsCell`, but never actually created a Comment model in `schema.prisma` or created an SDL and service! We'll be rectifying this soon. But this demonstrates another huge benefit of working with Storybook: you can build out UI functionality completely isolated from the api-side. In a team setting this is great because a web-side team can work on the UI while the api-side team can be building the backend end simultaneously and one doesn't have to wait for the other.

### Testing

We added a component, `CommentsCell`, and edited another, `Article`, so what do we test, and where?

#### Testing Comments

The actual `Comment` component does most of the work so there's no need to test all of that functionality again in `CommentsCell`: our `Comment` tests cover that just fine. What things does `CommentsCell` do that make it unique?

* Has a loading message
* Has an error message
* Has a failure message
* When it renders successfully, it outputs as many comments as were returned by the `QUERY` (*what* is rendered we'll leave to the `Comment` tests)

The default `CommentsCell.test.js` actually tests every state for us, albeit at an absolute minimum level—it make sure no errors are thrown:

```javascript
import { render } from '@redwoodjs/testing/web'
import { Loading, Empty, Failure, Success } from './CommentsCell'
import { standard } from './CommentsCell.mock'

describe('CommentsCell', () => {
  it('renders Loading successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => {
      render(<Empty />)
    }).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => {
      render(<Failure error={new Error('Oh no')} />)
    }).not.toThrow()
  })

  it('renders Success successfully', async () => {
    expect(() => {
      render(<Success comments={standard().comments} />)
    }).not.toThrow()
  })
})
```

And that's nothing to scoff at! As you've probably experienced, a React component usually either works 100% or blows up spectacularly. If it works, great! If it fails then the test fails too, which is exactly what we want to happen.

But in this case we can do a little more to make sure `CommentsCell` is doing what we expect. Let's update the `Success` test in `CommentsCell.test.js` to check that exactly the number of comments we passed in as a prop are rendered. How do we know a comment was rendered? How about if we check that each `comment.body` (the most important part of the comment) is present on the screen:

```javascript {3,27-32}
// web/src/components/CommentsCell/CommentsCell.test.js

import { render, screen } from '@redwoodjs/testing/web'
import { Loading, Empty, Failure, Success } from './CommentsCell'
import { standard } from './CommentsCell.mock'

describe('CommentsCell', () => {
  it('renders Loading successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => {
      render(<Empty />)
    }).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => {
      render(<Failure error={new Error('Oh no')} />)
    }).not.toThrow()
  })

  it('renders Success successfully', async () => {
    const comments = standard().comments
    render(<Success comments={comments} />)

    comments.forEach((comment) => {
      expect(screen.getByText(comment.body)).toBeInTheDocument()
    })
  })
})

```

We're looping through each `comment` from the mock, the same mock used by Storybook, so that even if we add more later, we're covered. You may find youself writing a test and saying "just test that there are 3 comments," which will work today, but months from now when you add more comments to the mock to try some different iterations in Storybook, that test will start failing. Avoid hardcoding data like this into your test when you can derive it from your mocked data!

#### Testing Article

The functionality we added to `Article` says to show the comments for the post if we are *not* showing the summary. We've got a test for both the "full" and "summary" renders already. Generally you want your tests to be testing "one thing" so let's add two additional tests for our new functionality:

```javascript {3,5,22-29,42-49}
// web/src/components/Article/Article.test.js

import { render, screen, waitFor } from '@redwoodjs/testing'
import Article from './Article'
import { standard } from 'src/components/CommentsCell/CommentsCell.mock'

const ARTICLE = {
  id: 1,
  title: 'First post',
  body: `Neutra tacos hot chicken prism raw denim, put a bird on it enamel pin post-ironic vape cred DIY. Street art next level umami squid. Hammock hexagon glossier 8-bit banjo. Neutra la croix mixtape echo park four loko semiotics kitsch forage chambray. Semiotics salvia selfies jianbing hella shaman. Letterpress helvetica vaporware cronut, shaman butcher YOLO poke fixie hoodie gentrify woke heirloom.`,
  createdAt: new Date().toISOString(),
}

describe('Article', () => {
  it('renders a blog post', () => {
    render(<Article article={ARTICLE} />)

    expect(screen.getByText(ARTICLE.title)).toBeInTheDocument()
    expect(screen.getByText(ARTICLE.body)).toBeInTheDocument()
  })

  it('renders comments when displaying a full blog post', async () => {
    const comment = standard().comments[0]
    render(<Article article={ARTICLE} />)

    await waitFor(() =>
      expect(screen.getByText(comment.body)).toBeInTheDocument()
    )
  })

  it('renders a summary of a blog post', () => {
    render(<Article article={ARTICLE} summary={true} />)

    expect(screen.getByText(ARTICLE.title)).toBeInTheDocument()
    expect(
      screen.getByText(
        'Neutra tacos hot chicken prism raw denim, put a bird on it enamel pin post-ironic vape cred DIY. Str...'
      )
    ).toBeInTheDocument()
  })

  it('does not render comments when displaying a summary', async () => {
    const comment = standard().comments[0]
    render(<Article article={ARTICLE} summary={true} />)

    await waitFor(() =>
      expect(screen.queryByText(comment.body)).not.toBeInTheDocument()
    )
  })
})
```

Notice we're importing the mock from a completely different component—nothing wrong with that!

We're introducing a new test function here, `waitFor()`, which will wait for things like GraphQL queries to finish running before checking for what's been rendered. Since `Article` renders `CommentsCell` we need to wait for the `Success` component of `CommentsCell` to be rendered.

> The summary version of `Article` does *not* render the `CommentsCell`, but we should still wait. Why? If we did mistakenly start including `CommentsCell`, but didn't wait for the render, we would get a falsely passing test—indeed the text isn't on the page but that's because it's still showing the `Loading` component! If we had waited we would have seen the actual comment body get rendered, and the test would (correctly) fail.

Okay we're finally ready to let users create their comments.
