# learn.redwoodjs.com

Deployment URL: https://learn-redwood.netlify.app

[![Crowdin](https://badges.crowdin.net/learn-redwoodjs/localized.svg)](https://crowdin.com/project/learn-redwoodjs)

This WIP site will be used to present multilingual tutorial docs for RedwoodJS at the subdomain `learn.redwoodjs.com`.

## Translation

We currently support English and French, but wish to include more languages!

Are you fluent in another language and want to contribute translations?

### Docusaurus 2 + Crowdin

We are using a late stage Alpha release of [Docusuraus 2](https://v2.docusaurus.io/docs/next/) that includes experimental integration with l10n management service Crowdin. i18n is a bleeding edge feature of Docusaurus and official documentation has not been released yet. However, there is [unofficial documentation here](https://deploy-preview-4014--docusaurus-2.netlify.app/classic/docs/next/i18n/introduction/), and we also have [this PR](https://github.com/facebook/docusaurus/pull/3325) and [this explanatory comment](https://github.com/facebook/docusaurus/issues/3317#issuecomment-742589241) to reference.

We are also learning from the source code for [Jest website migration on `docusaurus-2` branch](https://github.com/jest-website-migration/jest/tree/docusaurus-2/website-v2), which is using this same undocumented setup for thier localized docs. See their test site here: https://jest-v2.netlify.app/

## Getting started

```
yarn install

yarn start  # defaults to serving English locale
```

- **NOTE** Only one locale can be served in development at a time, so start yarn with the locale with it's language code if you want to test

```
yarn start --locale fr
```

P.S., the language switcher doesn't really work in development. No worries, things work better once the site is built and served. Try this and the locale switcher suddenly works:

```
yarn build

yarn serve
```

## Localized content

Source content markdown files are found in `docs/`, which map to locales in `i18n/%lang_code%/<plugin>/current/`.

```
├── docs
│   └── tutorial
├── i18n
│   └── fr
│       └── docusaurus-plugin-content-docs
│           └── current
│               └── tutorial
```

Target language codes follow [ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

Localized content without a "counterpart" for the source content fallsback to the source locale (English).

### Do not directly edit translations in this repo!

All translation is done via our [Crowdin repo](https://crowdin.com/project/learn-redwoodjs) to make sure our translations do not go stale.

Fully approved translations made from the above repo are auto-PR'ed into this Github repo (every 10 minutes).

We only have a `tutorial` category for now. Contact `@clairefro` to add new doc categories if needed.

### Note about relative paths

If a static asset or document is referenced in the source markdown with a relative path (ex: `[]!(../img/logo.svg)`), it will break in it's differently-nested i18n counterparts ("Where's that???").

Solution: copy the asset to the same "relativity" within the i18n target folder.

Cool thing is this also gives the opportunity to change image based on locale.

## Crowdin

Crowdin is our localization (l10n) manager. We use a Github integration to sync our [Crowdin repo](https://crowdin.com/project/learn-redwoodjs) with this repo.

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
