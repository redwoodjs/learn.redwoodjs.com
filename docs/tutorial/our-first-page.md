---
id: our-first-page
title: "Our First Page"
sidebar_label: "Our First Page"
---

Let's give our users something to look at besides the (awesome) Redwood welcome page (thanks [@alicelovescake](https://github.com/alicelovescake)!). We'll use the `redwood` command line tool to create a page for us:

```bash
yarn redwood generate page home /
```

The command above does four things:

- Creates `web/src/pages/HomePage/HomePage.js`. Redwood takes the name you specified as the first argument after `page` and [PascalCases](https://techterms.com/definition/pascalcase) it, then appends "Page" to construct your new page component. So "home" becomes "HomePage".
- Creates a test file to go along with this new page component at `web/src/pages/HomePage/HomePage.test.js` with a single, passing test. You _do_ write tests for your components, _don't you??_
- Creates a Storybook file for this component at `web/src/pages/HomePage/HomePage.stories.js`. Storybook is a wonderful tool for efficiently developing and organizing UI components. (If you want to take a peek ahead, we learn about Storybook in [Part 2 of the tutorial](/docs/tutorial2/introduction-to-storybook)).
- Adds a `<Route>` in `web/src/Routes.js` that maps the path `/` to the new _HomePage_ page.

> **Automatic import of pages in Routes file**
>
> If you look in Routes you'll notice that we're referencing a component, `HomePage`, that isn't imported anywhere. Redwood automatically imports all pages in the Routes file since we're going to need to reference them all anyway. It saves a potentially huge `import` declaration from cluttering up the routes file.

In case you didn't notice, this page is already live (your browser automatically reloaded):

![Default HomePage render](https://user-images.githubusercontent.com/300/148600239-6a147031-74bb-43e8-b4ef-776b4e2a2cc5.png)

It's not pretty, but it's a start! Open the page in your editor, change some text and save. Your browser should reload with your new text.

### Routing

Open up `web/src/Routes.js` and take a look at the route that was created:

```jsx{8}
// web/src/Routes.js

import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

Try changing the route to something like:

```html
<Route path="/hello" page={HomePage} name="home" />
```

As soon as you add your first route, you'll never see the initial Redwood splash screen again. From now on, when no route can be found that matches the requested URL, Redwood will render the `NotFoundPage`. Change your URL to [http://localhost:8910/hello](http://localhost:8910/hello) and you should see the homepage again.

Change the route path back to `/` before continuing!

### Simple Styles

Previous versions of this tutorial had you build everything without any styling, so we could really focus on the code, but let's face it: an unstyled site is pretty ugly. Let's add a really simple stylesheet that will just make things a *little* easier on the eyes as we build out the site. Paste the following into `web/src/index.css`:

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
ul {
  list-style-type: none;
  margin: 1rem 0;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 1rem 0 0 ;
}
h1 > a {
  text-decoration: none;
  color: black;
}
button, input, label, textarea {
  display: block;
  outline: none;
}
label {
  margin-top: 1rem;
}
.error {
  color: red;
}
input.error, textarea.error {
  border: 1px solid red;
}
.form-error {
  color: red;
  background-color: lavenderblush;
  padding: 1rem;
  display: inline-block;
}
.form-error ul {
  list-style-type: disc;
  margin: 1rem;
  padding: 1rem;
}
.form-error li {
  display: list-item;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.flex-between button {
  display: inline;
}
```

These styles will switch to whatever your OS's system font is, put a little margin between things, and just generally clean things up. Feel free to tweak it to your liking (or ignore these styles completely and stick with the browser default) but keep in mind that the following screenshots are made against this base stylesheet so your experience may vary.

![Default homepage with custom styles](https://user-images.githubusercontent.com/300/148600516-f8e048aa-451f-46f0-9749-078d63fe7b07.png)

Looking better already!
