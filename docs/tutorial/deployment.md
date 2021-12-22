---
id: deployment
title: "Deployment"
sidebar_label: "Deployment"
---

The whole reason we started building Redwood was to make full-stack web apps easier to build and deploy in the JS ecosystem. Several providers now offer ridiculously simple deployment, in many cases by simply commiting code to your `main` branch and pushing up to GitHub (or other supported provider). Three deployment/hosting providers that Redwood supports out of the box are:

* [Netlify](https://netlify.com)
* [Vercel](https://vercel.com)
* [Render](https://render.com)

In this section we're going to deploy to Render since it's the only one that supports a SQLite database! Otherwise we would need to switch over to Postgres in local development and use that going forward. This process is less than ideal at the moment, so we're going avoid it for the purposes of getting up and running quickly.

> **Can I use SQLite forever?**
>
> SQLite has a [documentation page](https://www.sqlite.org/whentouse.html) that discusses the long-term/high-performance use of SQLite in production environments. But to quote that doc:
>
> "SQLite works great as the database engine for most low to medium traffic websites (which is to say, most websites)...Generally speaking, any site that gets fewer than 100K hits/day should work fine with SQLite.
>
> Our blog will probably not be hitting these traffic numbers for at least a couple of weeks, so we should be safe for now. :)

## Redwood Setup

One more Redwood command will create a couple of files that Render needs to deploy our app properly:

```bash
yarn rw setup deploy render --database sqlite
```

You'll find a couple of generated files:

* */render.yaml* - contains config options for Render
* */api/src/functions/healthz.js* - a serverless function that Render will ping periodically to make sure our site is still up and running

That's it for Redwood setup! Make sure these latest changes are committed to git and pushed up to your GitHub or GitLab account.

## Render Setup

Head over to [Render's signup page](https://dashboard.render.com/register) and create your account. Using GitHub or GitLab will get you started even quicker. Now head to your Render dashboard, and select New Blueprint from the list of available services:

![image](https://user-images.githubusercontent.com/300/146836976-027311a9-7811-45a2-b191-0dff1b48cade.png)

If you haven't already, you'll be asked to link your GitHub/GitLab account, and then be presented with a list of your available repos. Select the repo we've been working on, whatever you ended up naming it, in this case `example-blog`:

![image](https://user-images.githubusercontent.com/300/146837734-ccbea910-8551-408a-b466-35ed8de36396.png)

The last screen asks for a Service Group name (use `example-blog` if you want) and Render verifies that we want to deploy from the `main` branch and lists the services that it will create: one for web and one for api:

![image](https://user-images.githubusercontent.com/300/146841166-3e552bdb-978f-466d-aacb-99abb66d4a8d.png)

Click **Apply** and then you should see some loading spinners as the services are created. Our site won't quite be live yet—there's one more step we need to do.

Now we just have to let Render know how to connect the web and api (so that GraphQL calls made from the web side end up being sent to the api side). Go back to the [Render Dashboard](https://dashboard.render.com/) and click on the `example-blog-api` service to view its settings. At the top, copy the URL:

![image](https://user-images.githubusercontent.com/300/146839410-832348dc-b6a8-4d89-a6d6-b45a2846c6da.png)

Back to the [Dashboard](https://dashboard.render.com/), now click on the `example-blog-web` service and then on the Redirects/Rewrites tab. In the first entry, where the Source is `/.redwood/functions/*` change the destination to the URL we just copied, with `*` appened on the end, for example: `https://example-blog-api.onrender.com/*`:

![image](https://user-images.githubusercontent.com/300/146839552-5d0b75d3-523b-4201-84bd-285f91b58fd5.png)

Be sure to click **Save Changes** and, while you're there, copy the URL at the top:

![image](https://user-images.githubusercontent.com/300/147162488-c2069866-ea72-47c5-b9cd-5d758a7e7818.png)

That's the public URL for our site! Now we just need to wait for the api side to finish deploying and we should be good to go.

> **My api build failed!**
>
> We've received reports of this happening from time-to-time on folks' very first deploy. If this happens to you, go to the api's detail page and click the **Manual Deploy** button at the upper right and select "Deploy Latest Commit" to try again. It's usually good to go on a second deploy.

## It's Alive!

Head to the URL that you copied from the web side service and the site should come up!

![image](https://user-images.githubusercontent.com/300/146846128-9530ea46-5a32-4ea2-8317-e2590f7d044f.png)

You won't have any blog posts (we only created those on our local machine) or a user, but you can set those back up now. Go to `/signup` and create your account. Once you're logged in you can go to the Posts admin page and start adding posts.

## Security

We don't want just anyone to come along and sign up to create posts for our blog, so we need to prevent new signups going forward. One way to do this would be to comment out the `SignupPage` route so that a browser can no longer request it:

```javascript {11}
// web/src/Routes.js

import { Private, Router, Route, Set } from '@redwoodjs/router'
import PostsLayout from 'src/layouts/PostsLayout'
import BlogLayout from 'src/layouts/BlogLayout'

const Routes = () => {
  return (
    <Router>
      <Route path="/login" page={LoginPage} name="login" />
      {/* <Route path="/signup" page={SignupPage} name="signup" /> */}
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Private unauthenticated="home">
        <Set wrap={PostsLayout}>
          <Route path="/admin/posts/new" page={PostNewPostPage} name="newPost" />
          <Route path="/admin/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
          <Route path="/admin/posts/{id:Int}" page={PostPostPage} name="post" />
          <Route path="/admin/posts" page={PostPostsPage} name="posts" />
        </Set>
      </Private>
      <Set wrap={BlogLayout}>
        <Route path="/contact" page={ContactPage} name="contact" />
        <Route path="/article/{id:Int}" page={ArticlePage} name="article" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

And remove the link to signup from `LoginPage`. But, if someone were clever, they could still create a user using the auth function that was created along with dbAuth. To prevent that we should throw an error in the signup handler instead of creating a user:

```javascript {7}
// api/src/functions/auth.js

// ...snip...

const signupOptions = {
  handler: () => {
    throw new Error()
  },
}

// ...snip...
```

Now the signup auth endpoint will return a `400 Bad Request` and not even leak any information as to why it's returning that. A hacker doesn't deserve that common courtesy!

Now, you could now commit and push up your changes, but if you do, a word of caution:

> On the free plan, *Render does not offer persistent data storage*, which means the user and posts you added to your site will be wiped out each time you deploy.

There are two things you can do:

1. Upgrade to Render's **Starter** plan, which allows you to persist a disk between deploys
2. Switch to a Postgres database, which Render provides for free for 90 days. However, you'll need to make this change in your local development environment as well and [installPostgres locally](https://redwoodjs.com/docs/local-postgres-setup.html#windows-and-other-platforms). Once you convert over, you'll need to [delete and recreate your migrations](https://redwoodjs.com/docs/local-postgres-setup.html#migrate-from-sqlite-to-postgres).
