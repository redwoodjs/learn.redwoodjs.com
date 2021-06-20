---
id: our-first-page
title: "La nostra prima pagina"
sidebar_label: "La nostra prima pagina"
---

Diamo ai nostri utenti qualcosa da guardare oltre alla pagina di benvenuto di Redwood. Useremo la command line di `redwood` per creare una pagina per noi:

    yarn redwood generate page home /

Il comando sopra fa quattro cose:

- Crea `web/src/pages/HomePage/HomePage.js`. Redwood prende il nome che hai specificato come primo argomento, converte in capitalize, e aggiunge "Page" per costruire il nuovo component.
- Crea un file di test che va insieme a questo nuovo component di pagina su `web/src/pages/HomePage/HomePage.test.js`, con un singolo test passato. Tu _devi_ scrivere test per i tuoi component, _no??_
- Crea un file Storybook per questo component `web/src/pages/HomePage/HomePage.stories.js`. Storybook è un meraviglioso strumento per l'efficiente sviluppo e organizzazione dei component dell'interfaccia utente. Se vuoi saperne di più, consulta questo topic [Redwood Forum](https://community.redwoodjs.com/t/how-to-use-the-new-storybook-integration-in-v0-13-0/873) per iniziare a usarlo nel tuo processo di sviluppo.
- Aggiunge un `<Route>` in `web/src/Routes.js` che mappa il percorso `/` alla nuova pagina _HomePage_.

> **Import automatico delle pagine nel file Routes**
> 
> Se guardi in Routes, noterai che stiamo facendo riferimento a un component, `HomePage`, che non è importato da nessuna parte. Redwood importa automaticamente tutte le pagine nel file Routes poiché avremo bisogno di referenziarle in ogni caso. Questo evita un potenzialmente enorme `import` che ingombri il file delle route.

Infatti questa pagina è già live (il browser è stato ricaricato automaticamente):

![Default HomePage render](https://user-images.githubusercontent.com/300/76237559-b760ba80-61eb-11ea-9a77-b5006b03031f.png)

Non è bella, ma è un inizio! Apri la pagina nel tuo editor, cambia del testo e salva. Il tuo browser dovrebbe ricaricare il tuo nuovo testo.

### Routing

Apri il file `web/src/Routes.js` e dai un'occhiata alla route che è stata creata:

```html
<Route path="/" page={HomePage} name="home" />
```

Prova a cambiare il percorso in qualcosa di simile:

```html
<Route path="/hello" page={HomePage} name="home" />
```

Non appena aggiungi la prima route, non vedrai mai più lo splash screen iniziale di Redwood. D'ora in poi, quando non è possibile trovare una route che corrisponda all'URL richiesto, Redwood farà il rendering di `NotFoundPage`. Cambia il tuo URL in http://localhost:8910/hello e dovresti vedere di nuovo la homepage.

Cambia il percorso nuovamente in `/` prima di continuare!

