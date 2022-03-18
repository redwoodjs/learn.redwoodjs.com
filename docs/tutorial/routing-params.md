---
id: routing-params
title: "Routing Params"
sidebar_label: "Routing Params"
---

Now that we have our homepage listing all the posts, let's build the "detail" page—a canonical URL that displays a single post. First we'll generate the page and route:

```bash
yarn rw g page Article
```

Now let's link the title of the post on the homepage to the detail page (and include the `import` for `Link` and `routes`):

```javascript {3,12}
// web/src/components/ArticlesCell/ArticlesCell.js

import { Link, routes } from '@redwoodjs/router'

// QUERY, Loading, Empty and Failure definitions...

export const Success = ({ articles }) => {
  return articles.map((article) => (
    <article key={article.id}>
      <header>
        <h2>
          <Link to={routes.article()}>{article.title}</Link>
        </h2>
      </header>
      <p>{article.body}</p>
      <div>Posted at: {article.createdAt}</div>
    </article>
  ))
}
```

If you click the link on the title of the blog post you should see the boilerplate text on `ArticlePage`:

![Article page](https://user-images.githubusercontent.com/300/146100107-895a37af-7549-46fe-8802-2628fe6b49ed.png)

But what we really need is to specify _which_ post we want to view on this page. It would be nice to be able to specify the ID of the post in the URL with something like `/article/1`. Let's tell the `<Route>` to expect another part of the URL, and when it does, give that part a name that we can reference later:

```jsx
// web/src/Routes.js

<Route path="/article/{id}" page={ArticlePage} name="article" />
```

Notice the `{id}`. Redwood calls these _route parameters_. They say "whatever value is in this position in the path, let me reference it by the name inside the curly braces". And while we're in the routes file, lets move the route inside the `Set` with the `BlogLayout`.

```jsx {15}
// web/src/Routes.js

import { Router, Route, Set } from '@redwoodjs/router'
import PostsLayout from 'src/layouts/PostsLayout'
import BlogLayout from 'src/layouts/BlogLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={PostsLayout}>
        <Route path="/posts/new" page={PostNewPostPage} name="newPost" />
        <Route path="/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
        <Route path="/posts/{id:Int}" page={PostPostPage} name="post" />
        <Route path="/posts" page={PostPostsPage} name="posts" />
      </Set>
      <Set wrap={BlogLayout}>
        <Route path="/article/{id}" page={ArticlePage} name="article" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

Cool, cool, cool. Now we need to construct a link that has the ID of a post in it:

```jsx
// web/src/components/ArticlesCell/ArticlesCell.js

<h2>
  <Link to={routes.article({ id: article.id })}>{article.title}</Link>
</h2>
```

For routes with route parameters, the named route function expects an object where you specify a value for each parameter. If you click on the link now, it will indeed take you to `/article/1` (or `/article/2`, etc, depending on the ID of the post).

You may have noticed that when trying to view the new single-article page that you're getting an error. This is because the boilerplate code included with the page when it was generated includes a link to the page itself—a link which now requires an `id`. Remove the link and your page should be working again:

```diff
// web/src/pages/ArticlePage.js

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ArticlePage = () => {
  return (
    <>
      <MetaTags title="Article" description="Article page" />

      <h1>ArticlePage</h1>
      <p>
        Find me in <code>./web/src/pages/ArticlePage/ArticlePage.js</code>
      </p>
      <p>
        My default route is named <code>article</code>, link to me with `
-       <Link to={routes.article()}>Article</Link>`
      </p>
    </>
  )
}

export default ArticlePage
```

### Using the Param

Ok, so the ID is in the URL. What do we need next in order to display a specific post? It sounds like we'll be doing some data retrieval from the database, which means we want a cell. Note the singular `Article` here since we're only displaying one:

```bash
yarn rw g cell Article
```

And then we'll use that cell in `ArticlePage`:

```javascript {4,11}
// web/src/pages/ArticlePage/ArticlePage.js

import { MetaTags } from '@redwoodjs/web'
import ArticleCell from 'src/components/ArticleCell'

const ArticlePage = () => {
  return (
    <>
      <MetaTags title="Article" description="Article page" />

      <ArticleCell />
    </>
  )
}

export default ArticlePage
```

Now over to the cell, we need access to that `{id}` route param so we can look up the ID of the post in the database. Let's update the query to accept a variable (and alias the real query name `post` to `article`):

```javascript {4,5,7-9}
// web/src/components/ArticleCell/ArticleCell.js

export const QUERY = gql`
  query ArticleQuery($id: Int!) {
    article: post(id: $id) {
      id
      title
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

export const Success = ({ article }) => {
  return JSON.stringify(article)
}
```

Okay, we're getting closer. Still, where will that `$id` come from? Redwood has another trick up its sleeve. Whenever you put a route param in a route, that param is automatically made available to the page that route renders. Which means we can update `ArticlePage` to look like this:

```javascript {6,11}
// web/src/pages/ArticlePage/ArticlePage.js

import { MetaTags } from '@redwoodjs/web'
import ArticleCell from 'src/components/ArticleCell'

const ArticlePage = ({ id }) => {
  return (
    <>
      <MetaTags title="Article" description="Article page" />

      <ArticleCell id={id} />
    </>
  )
}

export default ArticlePage
```

`id` already exists since we named our route param `{id}`. Thanks Redwood! But how does that `id` end up as the `$id` GraphQL parameter? If you've learned anything about Redwood by now, you should know it's going to take care of that for you. By default, any props you give to a cell will automatically be turned into variables and given to the query. "No way," you're saying. Way.

We can prove it! Try going to the detail page for a post in the browser and—uh oh. Hmm:

![Article error message](https://user-images.githubusercontent.com/300/146100555-cea8806a-70aa-43e5-b2b4-d49d84014c4e.png)

> By the way, this error message you're seeing is thanks to the `Failure` section of our Cell!

```plaintext
Error: Variable "$id" got invalid value "1"; Int cannot represent non-integer value: "1"
```

It turns out that route params are extracted as strings from the URL, but GraphQL wants an integer for the `id`. We could use `parseInt()` to convert it to a number before passing it into `ArticleCell`, but we can do better than that.

### Route Param Types

What if you could request the conversion right in the route's path? Introducing **route param types**. It's as easy as adding `:Int` to our existing route param:

```html
// web/src/Routes.js

<Route path="/article/{id:Int}" page={ArticlePage} name="article" />
```

Voilà! Not only will this convert the `id` param to a number before passing it to your Page, it will prevent the route from matching unless the `id` path segment consists entirely of digits. If any non-digits are found, the router will keep trying other routes, eventually showing the `NotFoundPage` if no routes match.

> **What if I want to pass some other prop to the cell that I don't need in the query, but do need in the Success/Loader/etc. components?**
>
> All of the props you give to the cell will be automatically available as props in the render components. Only the ones that match the GraphQL variables list will be given to the query. You get the best of both worlds! In our post display above, if you wanted to display some random number along with the post (for some contrived, tutorial-like reason), just pass that prop:
>
> ```javascript
> <ArticleCell id={id} rand={Math.random()} />
> ```
>
> And get it, along with the query result (and even the original `id` if you want) in the component:
>
> ```javascript
> export const Success = ({ article, id, rand }) => {
>   //...
> }
> ```
>
> Thanks again, Redwood!

### Displaying a Blog Post

Now let's display the actual post instead of just dumping the query result. We could copy the display from the articles on the homepage, but that's not very reusable! This is the perfect place for a good old fashioned component—define the display once and then reuse the component on the homepage and the article display page. Both `ArticlesCell` and `ArticleCell` will display our new component. Let's Redwood-up a component (I just invented that phrase):

```bash
yarn rw g component Article
```

Which creates `web/src/components/Article/Article.js` (and corresponding test and more!) as a super simple React component:

```javascript
// web/src/components/Article/Article.js

const Article = () => {
  return (
    <div>
      <h2>{'Article'}</h2>
      <p>{'Find me in ./web/src/components/Article/Article.js'}</p>
    </div>
  )
}

export default Article
```

> You may notice we don't have any explicit `import` statements for `React` itself. We (the Redwood dev team) got tired of constantly importing it over and over again in every file so we automatically import it for you!

Let's copy the `<article>` section from `ArticlesCell` and put it here instead, taking the `article` itself in as a prop:

```javascript {3,5,7-14}
// web/src/components/Article/Article.js

import { Link, routes } from '@redwoodjs/router'

const Article = ({ article }) => {
  return (
    <article>
      <header>
        <h2>
          <Link to={routes.article({ id: article.id })}>{article.title}</Link>
        </h2>
      </header>
      <div>{article.body}</div>
      <div>Posted at: {article.createdAt}</div>
    </article>
  )
}

export default Article
```

And update `ArticlesCell` and `ArticleCell` (note the plural and singular naming) to use this new component instead:

```javascript {3,26}
// web/src/components/ArticlesCell/ArticlesCell.js

import Article from 'src/components/Article'

export const QUERY = gql`
  query ArticlesQuery {
    articles: posts {
      id
      title
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

export const Success = ({ articles }) => {
  return articles.map((article) => (
    <Article key={article.id} article={article} />
  ))
}

```

```javascript {3,25}
// web/src/components/ArticleCell/ArticleCell.js

import Article from 'src/components/Article'

export const QUERY = gql`
  query FindArticleQuery($id: Int!) {
    article: post(id: $id) {
      id
      title
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

export const Success = ({ article }) => {
  return <Article article={article} />
}
```

And there we go! We should be able to move back and forth between the homepage and the detail page. If you've only got one blog post then the homepage and single-article page will be identical! Head to the posts admin and create a couple more, won't you?

![Article page showing an article](https://user-images.githubusercontent.com/300/146101296-f1d43812-45df-4f1e-a3da-4f6a085bfc08.png)

> If you like what you've been seeing from the router, you can dive deeper into the [Redwood Router](https://redwoodjs.com/docs/redwood-router) guide.

### Summary

To recap:

1. We created a new page to show a single post (the "detail" page).
2. We added a route to handle the `id` of the post and turn it into a route param, even coercing it into an integer.
3. We created a cell to fetch and display the post.
4. Redwood made the world a better place by making that `id` available to us at several key junctions in our code and even turning it into a number automatically.
5. We turned the actual post display into a standard React component and used it in both the homepage and new detail page.

