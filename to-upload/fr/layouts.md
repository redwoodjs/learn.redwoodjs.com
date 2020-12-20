---
id: layouts
title: Layouts
sidebar_label: Layouts
---

Une façon de résoudre la duplication du `<header>` aurait pu être de créer un composant `<Header>` et l'inclure à la fois dans `HomePage` et `AboutPage`. C'est valide! Mais il y a beaucoup mieux... Dans l'idéal, votre code ne devrait comporter qu'une seule et unique balise `<header>`.

Lorsque vous regardez à ces deux pages, quelle est leur raison d'être principale? Toutes deux ont un peu de contenu à afficher. Toutes deux ne devraient pas avoir à connaître ce qui vient avant ce contenu (comme un `<header>`), ou après ce même contenu (comme un `<footer>`). C'est exactement ce que font les "Layouts": ils entourent une page dans un composant qui va ensuite afficher à l'intérieur le contenu de la page:

<img src="https://user-images.githubusercontent.com/300/70486228-dc874500-1aa5-11ea-81d2-eab69eb96ec0.png" alt="Diagramme de structure des Layouts" width="300" />

Utilisons Redwood pour générer un layout contenant ce `<header>` :

    yarn redwood g layout blog

> **raccourci `generate`**
>
> Désormais nous utiliserons le raccourci `g` à la place de `generate`

Ce faisant, nous avons créé le fichier `web/src/layouts/BlogLayout/BlogLayout.js` et un son fichier de test associé. Nous appellerons ce dernier le "blog" layout car nous aurons certainement d'autres layout plus tard (un layout "admin" par exemple).

Supprimez ce `<header>` de `HomePage` et `AboutPage` et copier son contenu à l'intérieur du layout. Supprimons également le doublon de la balise `<main>` par la même occasion.

```javascript{3,7-19}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from '@redwoodjs/router'

const BlogLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>Redwood Blog</h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default BlogLayout
```

`children` est l'endroit où la magie opère! Toute page passée en argument à un layout s'affiche là. Pour en revenir à `HomePage` et `AboutPage`, en les entourant simplement au sein du `<BlogLayout>`, nos deux pages ne font désormais que ce qu'elles sont supposées faire: afficher leur contenu. Nous pouvons maintenant supprimer les imports de `Link`et `Route` puisqu'ils figurent également dans le Layout.

```javascript{3,6}
// web/src/pages/HomePage/HomePage.js

import BlogLayout from 'src/layouts/BlogLayout'

const HomePage = () => {
  return <BlogLayout>Home</BlogLayout>
}

export default HomePage
```

```javascript{4,8-14}
// web/src/pages/AboutPage/AboutPage.js

import { Link, routes } from '@redwoodjs/router'
import BlogLayout from 'src/layouts/BlogLayout'

const AboutPage = () => {
  return (
    <BlogLayout>
        <p>
          Ce site est créé avec pour seule intention de démontrer la puissance créative de Redwood! Oui, c'est très 
          impressionant :D
        </p>
      <Link to={routes.home()}>Return home</Link>
    </BlogLayout>
  )
}

export default AboutPage
```

> **L'alias `src`**
>
> Remarquez que l'import utilise `src/layouts/BlogLayout` et non `../src/layouts/BlogLayout` ou `./src/layouts/BlogLayout`. Pouvoir se contenter d'ajouter uniquement `src` est un petit apport bien pratique de Redwood: `src` est un alias pour le chemin du répertoire `src` du workspace courant. En d'autres termes, lorsque vous travaillez dans `web`, `src` pointe vers `web/src`. Et lorsque vous travaillez dans `api` il pointe vers `api/src`. 

Revenez donc dans votre navigateur, et vous devriez alors voir...... rien de nouveau. Et c'est très bien! Votre layout fonctionne parfaitement.

> **Pourquoi certaines choses sont nommées d'une certaine façon?**
>
> Il est possible que vous ayez remarqué quelques répetitions dans le nom des fichiers utilisés par Redwood. Ainsi les pages se trouvent dans un répertoire appelé `/pages`, et contiennent de nouveau `Page` dans leur nom. Idem pour les Layouts. Pourquoi de choix?
>
> Lorsque vous avez des dizaines de fichiers ouverts dans votre éditeur de code, il est facile de se perdre. C'est d'autant plus le cas lorsque vous avez des fichiers aux noms similaires dans des répertoires différents. A l'usage, il nous est apparut que cette petite répetition dans les noms était au final bien pratique lorsqu'il s'agit de repérer un fichier précis parmi tous les onglets ouverts..
>
> Le plugin [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) peut également vous aider à distinguer les fichiers entre eux.
>
> <img src="https://user-images.githubusercontent.com/300/73025189-f970a100-3de3-11ea-9285-15c1116eb59a.png" width="400" />

### Retour à la Maison, encore une fois

Ajoutons encore un autre `<Link>` de façon à ce que le titre et le logo pointent vers la page d'accueil:

```javascript{9-11}
// web/src/layouts/BlogLayout/BlogLayout.js

import { Link, routes } from '@redwoodjs/router'

const BlogLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>
          <Link to={routes.home()}>Redwood Blog</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default BlogLayout
```

Enfin nous pouvons éliminer de la page About le lien "Retour à la page d'accueil" devenu superflu (ainsi que les imports `Link` et `routes` associés).

```javascript
// web/src/pages/AboutPage/AboutPage.js

import BlogLayout from 'src/layouts/BlogLayout'

const AboutPage = () => {
  return (
    <BlogLayout>
      <p>
        Ce site est créé avec pour seule intention de démontrer la puissance créative de Redwood! Oui, c'est très 
        impressionant :D
      </p>
    </BlogLayout>
  )
}

export default AboutPage
```
