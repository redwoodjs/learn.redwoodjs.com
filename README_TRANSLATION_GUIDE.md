# Translation Guide

**IMPORTANT: Do not translate directly in this repo!**

All content is translated via our [Crowdin repo](https://crowdin.com/project/learn-redwoodjs/) so we can keep our docs from going stale.

Getting involved is easy! Crowdin lets you sign in with your Github account. Read below to find out how to get started.

## Roles

There are two roles in which you can help out.

| Role        | Description                                                  | Language Proficiency                                        |
| ----------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| Translator  | Translate content in Crowdin from English to target language | English: Intermediate+ <br />Target: Native level preferred |
| Proofreader | Approve/reject translated content in Crowdin                 | English: Intermediate+ <br />Target: Advanced               |

Translators can double as proofreaders for other people's translations in their proficient language(s).

Yes, these are subjective requirements :) The goal is to make Redwood accessible by providing easy to read and engaging tutorial content.

## Current Languages

| Language | Translators | Proofreaders |
| -------- | ----------- | ------------ |
| French   | @Thieffen, @noire.munich  | @Thieffen    |
| Japanese | --          | @clairefro   |

Want to add yourself to a translator and/or proofreader role for a language? Don't see your language here and wish to contribute?

Tag @clairefro in a new issue in this repo and we'll get it started!

## Guide for translators

In Crowdin, go to your target language and look for any incomplete translations. You then translate each untranslated string directly in Crowdin's interface.

### Frontmatter

When translating, keep the frontmatter `id` the same as English. This id is used for placing items correctly in the sidebar and must be the same for all locales of a given document.

`title` and `sidebar_label` however **can** and **should** be translated! Use double quotes `""` - it's a habit to prevent YAML breaking on special characters like `:`.

example

English
```md
---
id: welcome-to-redwood
title: "Welcome to Redwood"
sidebar_label: "Welcome to Redwood"
---

French (`id` stays in English!)
---
id: welcome-to-redwood
title: "Bienvenue chez Redwood"
sidebar_label: "Bienvenue chez Redwood"
---
```

### Code blocks
Leave code blocks as-is. There is an icon in the input box for translation that copies the source string in one click: 

![image](https://user-images.githubusercontent.com/9841162/109427680-5c9a1300-79a8-11eb-9a0c-c28cfa781db5.png)

### Troubleshooting

Crowdin is a pretty cool tool but it has its quirks - feel free to reach out to the internet or @clairefro if you get stuck.

## FAQ

**I finished translating in Crowdin... Where's the PR?!?**

Translations are only eligible for auto-PR once 100% approved. After approval, it takes ~10 minutes until the PR will sync to this repo.

**I found a typo in an existing translation, can I update it?**

Yes please!

**I see weird symbols like `<0>` in Crowdin strings... what?**

Those symbols are stand-ins for html tags like `<a></a>`. It is how Crowdin can map the tags to your translated content. In general, Crowdin tries to hide content that is not subject for translation, as to reduce clutter for translators.

**Are there term glossaries to ensure consistency between translators in the same language?**

You can help us start some if you like! There is a glossary tab in Crowdin.

**This whole process is a little confusing.**

Your feedback will help us smooth things out!

## Guide for proofreaders

Coming soon!
