---
id: a-second-page-and-a-link
title: "Una seconda pagina e un link"
sidebar_label: "Una seconda pagina e un link"
---

Creiamo una pagina "About" per il nostro blog in modo che tutti sappiano quali sono i geni dietro questo risultato. Creeremo un'altra pagina utilizzando `redwood`:

    yarn redwood generate page about

Notare che non abbiamo specificato un percorso questa volta. Se lo lasci fuori dal comando `redwood generate page`, Redwood creerà una `Route` e gli darà un percorso che è lo stesso del nome della pagina che hai specificato preceduto da uno slash. In questo caso sarà `/about`.

> **Code-splitting per ogni pagina**
> 
> Man mano che aggiungi pagine alla tua applicazione, potresti iniziare a temere che sempre più codice debba essere scaricato dal client and ogni load della pagina. Non temere! Redwood automaticamente dividerà il codice su ogni Page, il che significa che i carichi iniziali della pagina possono essere incredibilmente veloci, e puoi creare tutte le pagine che vuoi senza doverti preoccupare dell'effetto sulla dimensione complessiva del bundle webpack. Se, tuttavia, si desidera che specifiche Page siano incluse nel bundle principale, è possibile sovrascrivere il comportamento predefinito.

http://localhost:8910/about dovrebbe mostrare la nostra nuova pagina. Ma nessuno lo troverà cambiando manualmente l'URL quindi aggiungiamo un link dalla nostra homepage alla pagina About e viceversa. Inizieremo a creare un semplice header e nav bar allo stesso tempo sulla HomePage:

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

Evidenziamo alcune cose qui:

- Redwood ama i [Function Component](https://www.robinwieruch.de/react-function-component). Faremo ampio uso di [React Hook](https://reactjs.org/docs/hooks-intro.html) strada facendo e questi sono abilitati solo nei component delle function. Sei libero di utilizzare class component, ma si consiglia di evitarli a meno che non abbia bisogno delle loro capacità speciali.
- Il tag Redwood `<Link>`, nel suo utilizzo più semplice, richiede un singolo attributo `to`. Quell'attributo `to` chiama una _named route function_ al fine di generare l'URL corretto. La funzione ha lo stesso nome dell'attributo `name` sul `<Route>`:

  `<Route path="/about" page={AboutPage} name="about" />`

  Se non ti piace il nome che il `redwood generate` utilizza per la tuo route, sentiti libero di cambiarlo all'interno di `Routes.js`! Le named route sono fantastiche perchè se mai dovessi cambiare il path associato ad una route, devo solo cambiarlo in `Routes.js` e ogni link che utilizza una named route function punterà ancora al punto corretto. Puoi anche passare una stringa all'attributo `to`, ma perderai tutti i vantaggi di Redwood che le named route forniscono.

### Torna alla home

Una volta arrivati alla pagina About non abbiamo alcun modo per tornare indietro quindi aggiungiamo un link anche lì:

```javascript {3,7-25}
// web/src/pages/AboutPage/AboutPage.js

import { Link, routes } from '@redwoodjs/router'

const AboutPage = () => {
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
      <main>
        <p>
          This site was created to demonstrate my mastery of Redwood: Look on my
          works, ye mighty, and despair!
        </p>
        <Link to={routes.home()}>Return home</Link>
      </main>
    </>
  )
}

export default AboutPage
```

Ottimo! Prova questo nel browser e verifica che si può navigare avanti e indietro.

Come sviluppatore di livello mondiale probabilmente hai visto quel `<header>` copiato e incollato e ha sussultato per il disgusto. Ti capiamo. Ecco perché Redwood ha una cosuccia chiamata _Layout_.

