---
id: layouts
title: "Layout"
sidebar_label: "Layout"
---

Un modo per risolvere il dilemma dell'`<header>` sarebbe creare un component `<Header>` e includerlo sia in `HomePage` che in `AboutPage`. Funziona, ma c'è una soluzione migliore? Idealmente ci dovrebbe essere un solo riferimento al `<header>` ovunque nel nostro codice.

Considerando queste due pagine, cosa dovrebbero davvero tenere in conto? Hanno alcuni contenuti che vogliono mostrare. Non si dovrebbe davvero preoccupare di quello che viene prima (come un `<header>`) o dopo (come un `<footer>`). Ecco dove si inseriscono i layout: eseguono un wrap della pagina in un component che poi fa il rendering della pagina come child. Il layout può contenere qualsiasi contenuto esterno alla pagina stessa. Concettualmente, il rendering finale sarà strutturato come qualcosa del tipo:

<img src="https://user-images.githubusercontent.com/300/70486228-dc874500-1aa5-11ea-81d2-eab69eb96ec0.png" alt="Layouts structure diagram" width="300" />

Creiamo un layout che mantenga quel `<header>`:

    yarn redwood g layout blog

> **`generate` shorthand**
> 
> D'ora in poi useremo l'alias `g` invece di `generate`

Questo ha creato `web/src/layouts/BlogLayout/BlogLayout.js` e un file di test associato. Stiamo chiamando questo layout "blog" perché potremmo avere altri layout in futuro (un layout "admin", magari?).

Taglia l'`<header>` sia da `HomePage` che da `AboutPage` e incollalo nel layout. Prendiamo anche il tag duplicato `<main>`:

```javascript {3,7-19}
// web/src/pages/HomePage/HomePage.js

import { Link, routes } from '@redwoodjs/router'

const HomePage = () => {
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
      <main>Home</main>
    </>
  )
}

export default HomePage
```

`children` è dove si verificherà la magia. Qualsiasi contenuto di pagina dato al layout verrà renderizzato qui. Ora le pagine sono tornate ad essere focalizzate sui contenuti che le riguardano (possiamo rimuovere l'import di `Link` e `routes` da `HomePage` dal momento che sono nel Layout). Per fare il rendering del nostro layout abbiamo bisogno di fare una modifica ai file di route. Fare un wrapping di `HomePage` e `AboutPage` con il `BlogLayout`, usando un `<Set>`:

```javascript {3,4,9-12}
// web/src/Routes. s

import { Router, Route, Set } from '@redwoodjs/router'
import BlogLayout from 'src/layouts/BlogLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={BlogLayout}>
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

> **L'alias `src`**
> 
> Notare che la dichiarazione import usa `src/layouts/BlogLayout` e non `../src/layouts/BlogLayout` o `./src/layouts/BlogLayout`. La possibilità di utilizzare solo `src` è una funzionalità di comodità fornita da Redwood: `src` è un alias del path `src` nel workspace attuale. Quindi, se stai lavorando in `web` allora `src` punta a `web/src` e in `api` punta a `api/src`.

Tornando sul browser dovresti vedere... nulla di diverso. Ma questo è bene, significa che il nostro layout sta funzionando.

> **Perché le cose vengono chiamate in questo modo?**
> 
> Potresti aver notato qualche ripetizione nei nomi dei file di Redwood. Le pagine risiedono in una directory chiamata `/pages` e contengono anche `Page` nel loro nome. Lo stesso vale per i Layout. Qual è il vantaggio?
> 
> Quando si hanno decine di file aperti nel vostro editor è facile perdersi, soprattutto quando si dispone di diversi file con nomi simili o anche uguali (capita in directory diverse). Immagina una dozzina di file nominati `index.js` e poi prova a trovare quello che stai cercando in quelli che hai aperto! Abbiamo trovato che la duplicazione extra nei nomi dei file vale il vantaggio di produttività durante la ricerca per uno specifico file aperto.
> 
> Se stai usando il plugin [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) questo aiuta anche a evitare ambiguità durante la navigazione attraverso lo stack dei component:
> 
> <img src="https://user-images.githubusercontent.com/300/73025189-f970a100-3de3-11ea-9285-15c1116eb59a.png" width="400" />

### Nuovamente indietro alla Home

Un altro `<Link>`, impostiamo il link title/logo alla homepage come di consueto:

```javascript {9-11}
// web/src/pages/HomePage/HomePage.js

import { Link, routes } from '@redwoodjs/router'

const HomePage = () => {
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
      <main>Home</main>
    </>
  )
}

export default HomePage
```

E quindi possiamo rimuovere il link extra "Return to Home" (e l'import Link/routes) che avevamo sulla pagina About:

```javascript
// web/src/pages/AboutPage/AboutPage.js

const AboutPage = () => {
  return (
    <p>
      This site was created to demonstrate my mastery of Redwood: Look on my
      works, ye mighty, and despair!
    </p>
  )
}

export default AboutPage
```
