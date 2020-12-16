# learn.redwoodjs.com

This WIP site will be used to present multilingual tutorial docs for RedwoodJS.

### TODO

- Hook up to Crowdin l10n management
- add EN tutorial content
- language switcher - doesn't actually work right now
- UI string translation

### Docusaurus 2 + Crowdin

We are using a yet-to-be-documented release of Docusuraus 2 that includes integration with l10n management service Crowdin. While there are no docs to work off of yet, we have [this PR](https://github.com/facebook/docusaurus/pull/3325) and [this explanatory comment](https://github.com/facebook/docusaurus/issues/3317#issuecomment-742589241) to reference

Also learning from reading source code for [jest website migration on `docusaurus-2` branch](https://github.com/jest-website-migration/jest/tree/docusaurus-2/website-v2), which is using this same undocumented setup for thier localized docs. See their test site here: https://jest-v2.netlify.app/

## Getting started

```
yarn install

yarn start
```

It seems that this canary release only allows viewing one additional locale at a time in dev, so if you want to see French docs start yarn with a `--locale` flag like this:

```
yarn start --locale fr
```

## Localized content

Source content markdown docs are found in `/docs/`.

Localized docs content is placed in same structure as source content from "mount point" `i18n/%two_letters_code%/docusaurus-plugin-content-docs/current/`, where `%two_letters_code%` is generally a locale's [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

Localized content without a "counterpart" for the source content defaults to the source locale.

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
