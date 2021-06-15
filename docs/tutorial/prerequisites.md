---
id: prerequisites
title: "Prerequisites"
sidebar_label: "Prerequisites"
---

This tutorial assumes you are already familiar with a few core concepts:

- [React](https://reactjs.org/)
- [GraphQL](https://graphql.org/)
- [The Jamstack](https://jamstack.org/)

You could work through this tutorial without knowing anything about these technologies but you may find yourself getting lost in terminology that we don't stop and take the time to explain. It also helps knowing where the line is between what is built into React and what additional features Redwood brings to the table.

### Redwood Versions

You will need to be on v0.25 or greater of Redwood to complete the tutorial. If this is your first time using Redwood then no worries: the latest version will be installed automatically when you create your app skeleton! If you have an existing site created with a version prior to 0.25 you'll need to upgrade. Run this command in the root of your app and follow the prompts:

```bash
yarn redwood upgrade
```

### Node.js and Yarn Versions

During installation, RedwoodJS checks if your system meets version requirements for Node and Yarn:

- node: ">=14"
- yarn: ">=1.15"

If your system versions do not meet both requirements, _the installation bootstrap will result in an ERROR._ To check, please run the following from your terminal command line:

```
node --version
yarn --version
```

Please do upgrade accordingly. Then proceed to the Redwood installation when you're ready!

> **Installing Node and Yarn**
>
> There are many ways to install and manage both Node.js and Yarn. If you're installing for the first time, we recommend the following:
>
> **Yarn**
>
> - We recommend following the [instructions via Yarnpkg.com](https://classic.yarnpkg.com/en/docs/install/).
>
> **Node.js**
>
> - For **Linux** and **Mac** users, `nvm` is a great tool for managing multiple versions of Node on one system. It takes a bit more effort to set up and learn, however, in which case getting the latest [installation from Nodejs.org](https://nodejs.org/en/) works just fine.
>   - For **Mac** users, if you already have Homebrew installed, you can use it to [install `nvm`](https://formulae.brew.sh/formula/nvm) as well. Otherwise, follow the [installation instructions from `nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).
>   - For **Linux** users, you can follow the [installation instructions from `nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).
> - We recommend **Windows** users visit [Nodejs.org](https://nodejs.org/en/) for installation.
>
> If you're confused about which of the two current Node versions to use, we recommend using the most recent "even" LTS, which is currently v14.

