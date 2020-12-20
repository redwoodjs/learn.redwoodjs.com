---
id: deployment
title: "Deployment"
sidebar_label: "Deployment"
---

Part 4 of the video tutorial picks up here:

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/UpD3HyuZkvY?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; modestbranding; showinfo=0" allowfullscreen></iframe>
</div>

The whole reason we started building Redwood was to make full-stack web apps easier to build and deploy on the Jamstack. You've seen what building a Redwood app is like, how about we try deploying one?

We've only got one change to make to the codebase to get it ready for deployment and we've got a generator to do it for us:

```terminal
yarn rw g deploy netlify
```

This creates a file at `/netlify.toml` which contains the commands and file paths that Netlify needs to know about to build a Redwood app.

Before we continue, make sure your app is fully committed and pushed to GitHub, GitLab, or Bitbucket. We're going to link Netlify directly to our git repo so that a simple push to `main` will re-deploy our site. If you haven't worked on the Jamstack yet you're in for a pleasant surprise!

> **NOTE:** Git initializes with `master`. Don't know how to rename `master` to `main`? If you're pushing to GitHub, you can follow these steps:
>
> ```plaintext {4,6}
> git init
> git add .
> git commit -m 'First commit'
> git branch -m main
> git remote add origin ...
> git push -u origin main
> ```

### Vercel (alternative deploy target)

Redwood officially supports multiple hosting providers (with even more on the way). Although this Tutorial continues with a focus on Netlify deployment and authentication with Netlify Identity, you can deploy to [Vercel](https://vercel.com/redwoodjs-core) instead. To do this, first complete the "The Database" section below, but then use this [Vercel deploy walkthrough](https://redwoodjs.com/docs/deploy#redwood-deploy-configuration) in place of the following "Netlify" instructions. **Note**: Netlify Identity, used in upcoming "Authentication" section, won’t work on the Vercel platform.

### The Database

We'll need a database somewhere on the internet to store our data. We've been using SQLite locally, but that's a file-based store meant for single-user. SQLite isn't really suited for the kind of connection and concurrency requirements a production website will require. For this part of this tutorial, we will use Postgres. (Prisma currently supports SQLite, Postgres and MySQL.) Don't worry if you aren't familiar with Postgres, Prisma will do all the heavy lifting. We just need to get a database available to the outside world so it can be accessed by our app.

First we'll let Prisma know that we intend to use Postgres in addition to SQLite so it will build client libraries for both. Update the `provider` entry in `schema.prisma`:

```javascript
provider = ["sqlite", "postgresql"];
```

> If you are deploying to Netlify and using Prisma version `< 2.11.0`, you will need to add `rhel-openssl-1.0.x` to your `binaryTargets`:
>
> ```javascript
> // api/db/schema.prisma
>
> generator client {
>   provider      = "prisma-client-js"
>   binaryTargets = ["native", "rhel-openssl-1.0.x"]
> }
> ```

If you'd like to develop locally with Postgres, see the
[Local Postgres Setup](https://redwoodjs.com/docs/local-postgres-setup) guide.

> For now, you need to set up your own database, but we are working with various infrastructure providers to make this process simpler and more Jamstacky. Stay tuned for improvements in that regard!

There are several hosting providers where you can quickly start up a Postgres instance:

- [Heroku](https://www.heroku.com/postgres)
- [Digital Ocean](https://www.digitalocean.com/products/managed-databases)
- [AWS](https://aws.amazon.com/rds/postgresql/)

We're going to go with Heroku for now because it's a) free and b) easier to get started from scratch than AWS.

Head over to [Heroku](https://signup.heroku.com/) and create an account or log in. Then click that **Create a new app** button:

<img alt="Screen Shot 2020-02-03 at 3 22 36 PM" src="https://user-images.githubusercontent.com/300/73703866-438c3900-46a6-11ea-9a90-bdab2fed8bff.png" />

Give it a name like "redwoodblog" if it's available. Go to the **Resources** tab and then click **Find more add-ons** in the **Add-ons** section:

<img alt="Screen Shot 2020-02-03 at 3 23 25 PM" src="https://user-images.githubusercontent.com/300/73703877-4e46ce00-46a6-11ea-87c0-079346f4d9b3.png" />

And scroll down to **Heroku Postgres**:

<img alt="Screen Shot 2020-02-03 at 3 23 48 PM" src="https://user-images.githubusercontent.com/300/73703883-556ddc00-46a6-11ea-8777-ee27d2202e0e.png" />

Click that and then on the detail page that comes up, click the **Install Heroku Postgres** button that's at the top right. On the next screen tell it you want to connect it to the app you just created, then click **Submit Order Form**:

<img alt="Screen Shot 2020-02-03 at 3 24 15 PM" src="https://user-images.githubusercontent.com/16427929/98684805-e759f200-2366-11eb-8dd5-6f283898ed6f.PNG"/>

You'll be returned to your app's detail page. You should be on the **Resources** tab and see the Heroku Postgres add-on ready to go:

<img alt="Screen Shot 2020-02-03 at 3 24 43 PM" src="https://user-images.githubusercontent.com/300/73703951-6ae30600-46a6-11ea-8d9b-a900b7af2ac5.png"/>

Click the **Heroku Postgres** link to get to the detail page, then the **Settings** tab and finally the **View Credentials...** button. We did all the steps above so that we could copy the URI listed at the bottom:

<img alt="Screen Shot 2020-02-03 at 3 25 31 PM" src="https://user-images.githubusercontent.com/300/73703956-70405080-46a6-11ea-81f2-bed99ca4c4cc.png" />

It will be really long and scroll off the right side of the page so make sure you copy the whole thing!

### Netlify

Now we're going to [create a Netlify account](https://app.netlify.com/signup) if you don't have one already. Once you've signed up and verified your email done just click the **New site from Git** button at the upper right:

<img src="https://user-images.githubusercontent.com/300/73697486-85f84a80-4693-11ea-922f-0f134a3e9031.png" />

Now just authorize Netlify to connect to your git hosting provider and find your repo. When the deploy settings come up you can leave everything as the defaults and click **Deploy site**.

Netlify will start building your app (click the **Deploying your site** link to watch the logs) and it will say "Site is live", but nothing will work. Why? We haven't told it where to find our database yet.

Go back to the main site page and then to **Site settings** at the top, and then **Build & Deploy** > **Environment**. Click **Edit Variables** and this is where we'll paste the database connection URI we got from Heroku (note the **Key** is "DATABASE_URL"). After pasting the value, append `?connection_limit=1` to the end. The URI will have the following format: `postgres://<user>:<pass>@<url>/<db>?connection_limit=1`.

![Adding ENV var](https://user-images.githubusercontent.com/300/83188236-3e834780-a0e4-11ea-8cfa-790c2e335a92.png)

> **Connection limit**
>
> When configuring a database, you'll want to append `?connection_limit=1` to the URI. This is [recommended by Prisma](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/deployment#recommended-connection-limit) when working with relational databases in a Serverless context.

Make sure to click the **Save** button. Now go over to the **Deploys** tab in the top nav and open the **Trigger deploy** dropdown on the right, then finally choose **Deploy site**:

![Trigger deploy](https://user-images.githubusercontent.com/300/83187760-835aae80-a0e3-11ea-9733-ff54969bba1f.png)

With a little luck (and SCIENCE) it will complete successfully! You can click the **Preview** button at the top of the deploy log page, or go back and click the URL of your Netlify site towards the top:

![Netlify URL](https://user-images.githubusercontent.com/300/83187909-bef57880-a0e3-11ea-97dc-e557248acd3a.png)

Did it work? If you see "Empty" under the About and Contact links then it did! Yay! You're seeing "Empty" because you don't have any posts in your brand new production database so head to `/admin/posts` and create a couple, then go back to the homepage to see them.

> If you view a deploy via the **Preview** button notice that the URL contains a hash of the latest commit. Netlify will create one of these for every push to `main` but will only ever show this exact commit, so if you deploy again and refresh you won't see any changes. The real URL for your site (the one you get from your site's homepage in Netlify) will show the latest deploy. See [branch deploys](#branch-deploys) below for more info.

If the deploy failed, check the log output in Netlify and see if you can make sense of the error. If the deploy was successful but the site doesn't come up, try opening the web inspector and look for errors. Are you sure you pasted the entire Postgres connection string correctly? If you're really, really stuck head over to the [Redwood Community](https://community.redwoodjs.com) and ask for help.

### Branch Deploys

Another neat feature of Netlify is _Branch Deploys_. When you create a branch and push it up to your repo, Netlify will build that branch at a unique URL so that you can test your changes, leaving the main site alone. Once your branch is merged to `main` then a deploy at your main site will run and your changes will show to the world. To enable Branch Deploys go to **Site settings** > **Build & deploy** > **Continuous Deployment** and under the **Deploy contexts** section click **Edit settings** and change **Branch deploys** to "All". You can also enable _Deploy previews_ which will create them for any pull requests against your repo.

![Netlify settings screenshot](https://user-images.githubusercontent.com/30793/90886476-c1016780-e3b2-11ea-851a-3014257484fd.png)

> You also have the ability to "lock" the `main` branch so that deploys do not automatically occur on every push—you need to manually tell Netlify to deploy the latest, either by going to the site or using the [Netlify CLI](https://cli.netlify.com/).

### A Note About DB Connections

In this tutorial, your lambda functions will be connecting directly to the Postgres database. Because Postgres has a limited number of concurrent connections it will accept, this does not scale very well. The proper solution is to put a connection pooling service in front of Postgres and connect to that from your lambda functions. To learn how to do that, see the [Connection Pooling](https://redwoodjs.com/docs/connection-pooling) guide.

We are working on making this process much easier, but keep it in mind before you deploy a Redwood app to production and announce it to the world.
