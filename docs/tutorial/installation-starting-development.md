---
id: installation-starting-development
title: "Installation & Starting Development"
sidebar_label: "Installation & Starting Development"
---

We'll use yarn ([yarn](https://yarnpkg.com/en/docs/install) is a requirement) to create the basic structure of our app:

    yarn create redwood-app ./redwoodblog

You'll have a new directory `redwoodblog` containing several directories and files. Change to that directory and we'll start the development server:

    cd redwoodblog
    yarn redwood dev

A browser should automatically open to http://localhost:8910 and you will see the Redwood welcome page:

![Redwood Welcome Page](https://user-images.githubusercontent.com/300/145314717-431cdb7a-1c45-4aca-9bbc-74df4f05cc3b.png)

> Remembering the port number is as easy as counting: 8-9-10!

The splash page gives you links to a ton of good resources, but don't get distracted: we've got a job to do!

### First Commit

Now that we have the skeleton of our Redwood app in place, it's a good idea to save the current state of the app as your first commit...just in case.

    git init
    git add .
    git commit -m 'First commit'

[Git](https://git-scm.com/) is another of those concepts we assume you know, but you can complete the tutorial without it. Even if you've never used it, you can go ahead and follow any `git` commands you see and you'll end up with nice snapshots of your codebase as you're working. But, if you don't know or care about git, you can safely ignore them.
