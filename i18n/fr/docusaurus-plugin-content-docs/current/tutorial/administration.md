---
id: administration
title: "Administration"
sidebar_label: "Administration"
custom_edit_url: https://github.com/redwoodjs/learn.redwoodjs.com/blob/main/README_TRANSLATION_GUIDE.md
---

Il semble raisonable de faire en sorte que les écrans d'administration soient regroupés sous un chemin `/admin`. Mettons à jour les routes de manière à ce que les quatre routes commençant par `/posts` commencent désormais paar `/admin/posts`:

```html
// web/src/Routes.js

<Route path="/admin/posts/new" page={NewPostPage} name="newPost" />
<Route path="/admin/posts/{id:Int}/edit" page={EditPostPage} name="editPost" />
<Route path="/admin/posts/{id:Int}" page={PostPage} name="post" />
<Route path="/admin/posts" page={PostsPage} name="posts" />
```

Allez à http://localhost:8910/admin/posts et notre page générée par scaffolding devrait s'afficher. Grâce aux routes nommées, nous n'avons pas à mettre à jour les `<Link>` créés lors du scaffold puisque l'attribut `name` reste identique!

> **Et l'authentification ?**
> 
> Sur la dernière page nous avons mentionné que nous allions créer une section admin **et** la mettre derrière un login. Jusqu'à maintenant nous n'avons fait que modifier les routes. Ne vous inquiétez pas, nous n'avons pas oublié! Nous allons mettre en place l'authentification dans une [prochaine étape](./authentication).

Que pensez-vous de mettre enfin en ligne tout ce que nous avons réalisé ?
