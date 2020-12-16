# learn.redwoodjs.com

This WIP site will be used to present multilingual tutorial docs for RedwoodJS.

### TODO

- Hook up to Crowdin l10n management
- add EN tutorial content
- language switcher
- UI string translation

### Docusaurus 2 + Crowdin

We are using a yet-to-be-documented release of Docusuraus 2 that includes integration with l10n management service Crowdin. While there are no docs to work off of yet, we have [this PR](https://github.com/facebook/docusaurus/pull/3325) and [this explanatory comment](https://github.com/facebook/docusaurus/issues/3317#issuecomment-742589241) to reference

# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
