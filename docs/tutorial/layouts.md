---
id: layouts
title: "Layouts"
sidebar_label: "Layouts"
---

One way to solve the duplication of the `<header>` would be to create a `<Header>` component and include it in both `HomePage` and `AboutPage`. That works, but is there a better solution? Ideally there should only be one reference to the `<header>` anywhere in our code.

When you look at these two pages what do they really care about? They have some content they want to display. They really shouldn't have to care what comes before (like a `<header>`) or after (like a `<footer>`). That's where layouts come in: they wrap a page in a component that then renders the page as its child. The layout can contain any content that's outside of the page itself. Conceptually, the final rendered document will be structured something like:

<img src="https://user-images.githubusercontent.com/300/70486228-dc874500-1aa5-11ea-81d2-eab69eb96ec0.png" alt="Layouts structure diagram" width="300"/>

Let's create a layout to hold that `<header>`:

```bash
yarn redwood g layout blog
```

> **`generate` shorthand**
>
> From now on we'll use the shorter `g` alias instead of `generate`

That created `web/src/layouts/BlogLayout/BlogLayout.js` and an associated test file. We're calling this the "blog" layout because we may have other layouts at some point in the future (an "admin" layout, perhaps?).

Cut the `<header>` from both `HomePage` and `AboutPage` and paste it in the layout instead. Let's take out the duplicated `<main>` tag as well:

```javascript {3,7-19}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from '@redwoodjs/router'

const BlogLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>Redwood Blog</h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default BlogLayout
```

```javascript
// web/src/pages/AboutPage/AboutPage.js

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <MetaTags title="About" description="About page" />

      <p>
        This site was created to demonstrate my mastery of Redwood: Look on my
        works, ye mighty, and despair!
      </p>
      <Link to={routes.home()}>Return home</Link>
    </>
  )
}

export default AboutPage
```

```javascript
// web/src/pages/HomePage/HomePage.js

import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      Home
    </>
  )
}

export default HomePage
```

In `BlogLayout.js`, `children` is where the magic will happen. Any page content given to the layout will be rendered here. And now the pages are back to focusing on the content they care about (we can remove the import for `Link` and `routes` from `HomePage` since those are in the Layout instead).

To actually render our layout we'll need to make a change to our routes files. We'll wrap `HomePage` and `AboutPage` with the `BlogLayout`, using a `<Set>`. Unlike pages, we do actually need an `import` statement for layouts:

```javascript {3,4,9-12}
// web/src/Routes.js

import { Router, Route, Set } from '@redwoodjs/router'
import BlogLayout from 'src/layouts/BlogLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={BlogLayout}>
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

> **The `src` alias**
>
> Notice that the import statement uses `src/layouts/BlogLayout` and not `../src/layouts/BlogLayout` or `./src/layouts/BlogLayout`. Being able to use just `src` is a convenience feature provided by Redwood: `src` is an alias to the `src` path in the current workspace. So if you're working in `web` then `src` points to `web/src` and in `api` it points to `api/src`.

Back to the browser (you may need to manually refresh) and you should see...nothing different. But that's good, it means our layout is working!

> **Why are things named the way they are?**
>
> You may have noticed some duplication in Redwood's file names. Pages live in a directory called `/pages` and also contain `Page` in their name. Same with Layouts. What's the deal?
>
> When you have dozens of files open in your editor it's easy to get lost, especially when you have several files with names that are similar or even the same (they happen to be in different directories). Imagine a dozen files named `index.js` and then trying to find the one you're looking for in your open tabs! We've found that the extra duplication in the names of files is worth the productivity benefit when scanning for a specific open file.
>
> If you're using the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) plugin this also helps disambiguate when browsing through your component stack:
>
> <img src="https://user-images.githubusercontent.com/300/145901282-e4b6ec92-8cee-42d0-97ea-1ffe99328e53.png" width="400"/>

### Back Home Again

A couple more `<Link>`s: let's have the title/logo link back to the homepage, and we'll add a nav link to Home as well:

```javascript {9-11,14-16}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from '@redwoodjs/router'

const BlogLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>
          <Link to={routes.home()}>Redwood Blog</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default BlogLayout
```

And then we can remove the extra "Return to Home" link (and Link/routes import) that we had on the About page:

```javascript
// web/src/pages/AboutPage/AboutPage.js

import { MetaTags } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <MetaTags title="About" description="About page" />

      <p>
        This site was created to demonstrate my mastery of Redwood: Look on my
        works, ye mighty, and despair!
      </p>
    </>
  )
}

export default AboutPage
```

![image](https://user-images.githubusercontent.com/300/145901020-1c33bb74-78f9-415e-a8c8-c8873bd6630f.png)

Now we're getting somewhere! We removed all of that duplication and our header content (logo and navigation) are all in one place.

Everything we've done so far has been on the web side, which is all in the browser. Let's start getting the backend involved and see what all the hoopla is about GraphQL, Prisma and databases.
