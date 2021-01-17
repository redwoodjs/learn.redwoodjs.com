# learn.redwoodjs.com

Deployment URL: https://learn-redwood.netlify.app

[![Crowdin](https://badges.crowdin.net/learn-redwoodjs/localized.svg)](https://crowdin.com/project/learn-redwoodjs)

This WIP site will be used to present multilingual tutorial docs for RedwoodJS.

### TODO

- Establish and document a translation workflow
- UI string translation
- Add term glossary template
- Edit homepage content
- Style 💅🏽
- SEO 🤷

### Docusaurus 2 + Crowdin

We are using a late stage Alpha release of Docusuraus 2 that includes experimental integration with l10n management service Crowdin. The docs for V2 of Docusaurus can be found [here](https://v2.docusaurus.io/docs/next/), we also have [this PR](https://github.com/facebook/docusaurus/pull/3325) and [this explanatory comment](https://github.com/facebook/docusaurus/issues/3317#issuecomment-742589241) to reference

Also learning from reading source code for [jest website migration on `docusaurus-2` branch](https://github.com/jest-website-migration/jest/tree/docusaurus-2/website-v2), which is using this same undocumented setup for thier localized docs. See their test site here: https://jest-v2.netlify.app/

## Getting started

```
yarn install

yarn start  # defaults to serving English locale
```

- **NOTE** Only one locale can be served in development at a time, so start yarn with the locale you want to test

```
yarn start --locale fr
```

P.S., the language switcher doesn't really work in development. No worries, things work better once the site is built and served. Try this and the locale switcher suddenly works:

```
yarn build

yarn serve
```

## Localized content

Source content markdown docs are found in `/docs/..`.

Localized docs content is placed in same structure as source content from "mount point" `i18n/%two_letters_code%/docusaurus-plugin-content-docs/current/..`, where `%two_letters_code%` is generally a locale's [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

Localized content without a "counterpart" for the source content defaults to the source locale.

Every doc category directory (ex: 'Tutorial') needs to be mapped to a Crowdin translation flow.

We just have `tutorial` for now, but contact `@clairefro` to add new doc categories if needed.

### Note about relative paths

If a static asset or document is referenced in the source markdown with a relative path (ex: `[]!(../img/logo.svg)`), it will break in it's differently-nested i18n counterparts ("Where's that???").

Solution: copy the asset to the same "relativity" within the i18n target folder.

Cool thing is this also gives the opportunity to change image based on locale.

### crowdin.yml

Configuration file for crowdin integration. Useful for seeing how source docs are mapped to i18n folder

## Translation

**IMPORTANT: Do not translate directly in this repo!**

All content is translated via Crowdin so we can keep our docs from going stale.  
https://crowdin.com/project/learn-redwoodjs/

Translations made from the above repo are auto-PR'ed to this Github repo once approved.

### Frontmatter

When translating, keep frontmatter `id` as-is (same as English). This id is used for placing items correctly in the sidebar and must be the same for all counterpart docs.

`title` and `sidebar_label` however can and should be translated! Use quotes `""` - it's a habit to prevent YAML breaking on special characters like `:`.

example

```md
---
<!-- /docs/tutorial/welcome-to-redwood.md  -->
id: welcome-to-redwood
title: "Welcome to Redwood"
sidebar_label: "Welcome to Redwood"
---

---

<!-- /i18n/fr/docusaurus-plugin-content-docs/current/tutorial/welcome-to-redwood.md  -->

id: welcome-to-redwood
title: "Bienvenue chez Redwood"
sidebar_label: "Bienvenue chez Redwood"

---
```

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
