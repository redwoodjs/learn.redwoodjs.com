---
id: prerequisites
title: 'Prerequisites'
sidebar_label: 'Prerequisites'
---

Redwood is composed of several popular libraries to make full-stack web development easier. Unfortunately, we can't teach all of those technologies from scratch during this tutorial, so we're going to assume you are already familiar with a few core concepts:

- [React](https://reactjs.org/)
- [GraphQL](https://graphql.org/)
- [Prisma](https://prisma.io/)
- [Jamstack Deployment](https://jamstack.org/)

**Don't panic!** You can work through this tutorial without knowing much of anything about these technologies. You may find yourself getting lost in terminology that we don't stop and take the time to explain, but that's okay: just know that the nitty-gritty details of how those technologies work is out there and there will be plenty of time to learn them. As you learn more about them you'll start to see the lines between what Redwood provides on top of the stock implementations of these projects.

You could definitely learn them all at once, but it will be harder to determine where one ends and another begins, which makes it more difficult to find help once you're past the tutorial and want to dive deeper into one technology or another. Our advice? Make it through the tutorial and then start building something on your own! When you find that what you learned in the tutorial doesn't exactly apply to a feature you're trying to build, Google for where you're stuck ("prisma select only some fields") and you'll be an expert in no time. And don't forget our [Discourse](https://community.redwoodjs.com/) and [Discord](https://discord.gg/jjSYEQd) where you can get help from the creators of the framework, as well as tons of helpful community members.

### Redwood Versions

You will want to be on the latest release candidate of v1.0 or greater of Redwood to complete the tutorial. If this is your first time using Redwood then no worries: the latest version will be installed automatically when you create your app skeleton!

If you have an existing site created with a prior version, you'll need to upgrade and (most likely) apply code modifications. Follow this two step process:

1. For _each_ version included in your upgrade, follow the "Code Modifications" section of the specific version's Release Notes:
   - [Redwood Releases](https://github.com/redwoodjs/redwood/releases)
2. The upgrade to the latest version. Run the command:
   - `yarn redwood upgrade`

### Node.js and Yarn Versions

During installation, RedwoodJS checks if your system meets version requirements for Node and Yarn:

- node: ">=14.17 <=16.x"
- yarn: ">=1.15"

If your system versions do not meet both requirements, _the installation bootstrap will result in an ERROR._ To check, please run the following from your terminal command line:

```bash
node --version
yarn --version
```

Please do upgrade accordingly. Then proceed to the Redwood installation when you're ready!

> **Installing Node and Yarn**
>
> There are many ways to install and manage both Node.js and Yarn. If you're installing for the first time, we recommend the following:
>
> **1. Yarn**
> We recommend following the [instructions via Yarnpkg.com](https://classic.yarnpkg.com/en/docs/install/).
>
> **2. Node.js**
> Using the latest [installation from Nodejs.org](https://nodejs.org/en/) works just fine.
>
> - `nvm` is a great tool for managing multiple versions of Node on one system. It takes a bit more effort to set up and learn, however. Follow the [nvm installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating). (Windows users should go to [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)). For **Mac** users with Homebrew installed, you can alternatively use it to [install `nvm`](https://formulae.brew.sh/formula/nvm).
>
> If you're confused about which of the two current Node versions to use, we recommend using the most recent LTS, which is currently [v16.x](https://nodejs.org/download/release/latest-gallium/.

> **Windows:** Recommended Development Setup
>
> JavaScript development on Windows has specific requirements in addition to Yarn and npm. Follow our simple setup guide:
>
> - [Recommended Windows Development Setup](https://redwoodjs.com/cookbook/windows-development-setup)
