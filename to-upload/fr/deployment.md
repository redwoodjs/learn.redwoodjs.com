---
id: deployment
title: "Déploiement"
sidebar_label: "Déploiement"
---

La partie 4 de ce didacticiel en vidéo se trouve ici:

<div class="relative pb-9/16">
  <iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/UpD3HyuZkvY?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; modestbranding; showinfo=0" allowfullscreen></iframe>
</div>

La raison principale pour laquelle nous avons mis au point Redwood était de permettre aux développeurs de construire des applications web _full-stack_ plus facilement tout en adhérant à la philosophie Jamstack. Vous avez pu voir à quoi ressemble l'élaboration d'une application Redwood. Que pensez-vous de voir comment on la déploit?

Il n'y a qu'une modification à faire pour que notre application soit prête à être déployée, et bien entendu nous avons un générateur pour ça:

```terminal
yarn rw g deploy netlify
```

L'exécution de cette commande va créer un fichier `/netlify.toml` contenant les commandes et les chemins de fichiers dont Netlify a besoin afin de construire l'application.

Avant que nous ne poursuivions, assurez-vous que tous les commits soient faits et bien envoyés sur GitHub, GitLab or BitBucket. En effet, nous allons lier Netlify à notre dépôt Git de façon à ce tout nouveau push sur la branch `main` permette de re-déployer le site. Si vous n'avez jamais travaillé auparavant avec une application Jamstack, préparez-vous à une sympatique expérience!

> **NOTE:** Git utilise par défaut une branche `master`. Vous ne savez pas comment renommer `master` en `main`? Si vous utilisez GitHub, vous pouvez suivre ces étapes:
>
> ```plaintext {4,6}
> git init
> git add .
> git commit -m 'First commit'
> git branch -m main
> git remote add origin ...
> git push -u origin main
> ```

### Vercel (cible de déploiement alternative)

Redwood supporte officiellement plusieurs fournisseurs d'hébergement (et d'autres sont en cours d'ajout). Bien que ce didacticiel se poursuive en s'appuyant sur Netlify pour le déploiement et l'authentification, il vous est possible de déployer sur [Vercel](https://vercel.com/redwoodjs-core). Pour cela, commencer par achever la section suivante ("La Base de Données"), mais utilisez ce [guide de déploiement Vercel](https://redwoodjs.com/docs/deploy#redwood-deploy-configuration) à la place des instructions dédiées à Netlify. **Note**: Netlify Identity, used in the upcoming "Authentication" section, won't work on the Vercel platform.

### La Base de Données

Nous avons besoin d'une base de données quelque part sur Internet afin d'enregistrer nos données. Nous avons utilisé SQLite pendant la phase de développement, mais il s'agit d'un outil pensé pour être utilisé par un seul utilisateur. SQLite n'est pas vraiment adapté pour le type de connections concurrentes qu'une application requiert lorsqu'elle entre en production. Pour cette partie du didacticiel, nous utiliserons Postgres. (Prisma supporte à ce jour SQLite, Postgres et MySQL). Ne vous inquiétez pas si vous n'êtes pas familier de Postgres, Prisma va se charger de tout ça. Tout ce dont nous avons besoin c'est une base de données qui soit accessible depuis Internet, de telle manière que notre application puisse s'y connecter.

Tout d'abord, nous allons informer Prisma que nous souhaitons utiliser Postgres en plkus de SQLite, de telle manière que Prisma va construire un client pour ces deux bases de données. Mettez à jour l'entrée `provider` dans `schema.prisma`:

```javascript
provider = ["sqlite", "postgresql"];
```

Si vous souhaitez développer en local avec Postgres, [consultez le guide](https://redwoodjs.com/docs/local-postgres-setup).

> Pour l'instant, vous avez besoin de créer votre propre base de données, mais nous travaillons avec différents fournisseurs d'infrastructure pour mettre un place un processus plus simple et plus en phase avec la Jamstack. Plus d'informations sont à venir sur ce point!

Il existe différents fournisseurs d'hébergement qui vous permettent de créer rapidement une base de données Postgres:

- [Heroku](https://www.heroku.com/postgres)
- [Digital Ocean](https://www.digitalocean.com/products/managed-databases)
- [AWS](https://aws.amazon.com/rds/postgresql/)

Nous allons ici utiliser Heroku car 1) c'est gratuit, 2) plus facile à manipuler qu'AWS pour un néophyte.

Rendez-vous sur le site d'[Heroku](https://signup.heroku.com/), créez un nouveau compte ou identifiez-vous. Cliquez ensuite sur le boutton **create new app**.

<img alt="Screen Shot 2020-02-03 at 3 22 36 PM" src="https://user-images.githubusercontent.com/300/73703866-438c3900-46a6-11ea-9a90-bdab2fed8bff.png" />

Donnez lui un nom comme "redwoodblog". Puis allez sur l'onglet **Ressources** et cliquez sur le bouton **Find more add-ons** dans la section **Add-ons**:

<img alt="Screen Shot 2020-02-03 at 3 23 25 PM" src="https://user-images.githubusercontent.com/300/73703877-4e46ce00-46a6-11ea-87c0-079346f4d9b3.png" />

Déplacez-vous dans la page jusqu'à faire apparaître **Heroku Postgres**:

<img alt="Screen Shot 2020-02-03 at 3 23 48 PM" src="https://user-images.githubusercontent.com/300/73703883-556ddc00-46a6-11ea-8777-ee27d2202e0e.png" />

Une page de détail apparaît. Cliquez sur **Install Heroku Postgres** dans le coin supérieur droit. Sur l'écran suivant, précisez que vous souhaitez connecter la base à l'application que vous venez de créer. Cliquez enfin sur **Provision Add-on**.

<img alt="Screen Shot 2020-02-03 at 3 24 15 PM" src="https://user-images.githubusercontent.com/300/73703930-64548e80-46a6-11ea-9f1b-e06a183834f4.png" />

Vous êtes alors redirigé sur la page présentant les détails de votre application. Vous devriez alors pouvoir aller sur l'onglet **Resources** et constater que l'add-on Heroku Postgres et prêt à être utilisé:

<img alt="Screen Shot 2020-02-03 at 3 24 43 PM" src="https://user-images.githubusercontent.com/300/73703951-6ae30600-46a6-11ea-8d9b-a900b7af2ac5.png" />

Cliquez sur le lien Heroku Postgres pour vous rendre sur la page de détail, puis sur l'onglet **Settings** et enfin cliquez sur le boutton **View Credentials...**. Copiez l'URI située en bas de la page.

<img alt="Screen Shot 2020-02-03 at 3 25 31 PM" src="https://user-images.githubusercontent.com/300/73703956-70405080-46a6-11ea-81f2-bed99ca4c4cc.png" />

Cette ligne est particulièrement longue, assurez-vous que vous avez bien sélectionné et copié l'intégralité de la ligne!

### Netlify

Maintenant, si vous n'en avez pas déjà un, créez un [compte Netlify](https://app.netlify.com/signup). Ceci étant fait, cliquez simplement sur le boutton **New site from Git** situé en haut à droite:

<img src="https://user-images.githubusercontent.com/300/73697486-85f84a80-4693-11ea-922f-0f134a3e9031.png" />

Donnez l'autorisation à Netlify de se connecter à votre fournisseur d'hébergement Git, et sélectionnez le dépôt de votre application. Laissez les paramètres par défaut et cliquez sur **Deploy site**.

Netlify va alors construire votre application (cliquez sur **Deploying your site** pour prendre connaissance des logs) puis va dire "Site is live",... et rien ne va fonctionner :D Pourquoi? Et pardi, car nous n'avons pas précisé où se trouve notre base de données!

Retournez sur la page principale de Netlify, puis rendez-vous dans **Settings**, puis dans **Build & Deploy** > **Environment**. Cliquez sur **Edit variables**. C'est à cet endroit que nous allons coller l'URI de connection que nous avions copié depuis Heroku (notez que la valeur de **Key** est "DATABASE_URL"). Après avoir collé la valeur, ajoutez `?connection_limit=1` à la fin d'URI. Le format final de l'URI est donc: `postgres://<user>:<pass>@<url>/<db>?connection_limit=1`.

![Adding ENV var](https://user-images.githubusercontent.com/300/83188236-3e834780-a0e4-11ea-8cfa-790c2e335a92.png)

> Lorsque vous configurez la base de données, vous ajouterez de préférence `?connection_limit=1` à l'URI. Il s'agit d'une [recommandation pour l'utilisation de Prisma](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/deployment#recommended-connection-limit) dans le cadre d'une utilisation Serverless.

Assurez-vous de cliquer sur le boutton **Save**. Maintenant rendez-vous sur l'onglet **Deploys**, ouvrez le champ de sélection **Trigger deploy** sur la droite et choisissez **Deploy site**:

![Trigger deploy](https://user-images.githubusercontent.com/300/83187760-835aae80-a0e3-11ea-9733-ff54969bba1f.png)

Avec un peu de chance (et de science!!), tout va fonctionner correctement! Vous pouvez cliquer sur le bouton **Preview** en haut de page avec les logs, ou revenir à la page précédente et cliquer sur l'URL de déploiement de votre site située en haut de l'écran:

![Netlify URL](https://user-images.githubusercontent.com/300/83187909-bef57880-a0e3-11ea-97dc-e557248acd3a.png)

Est-ce que ça fonctionne? Si vous voyez "Empty" sous les liens _About_ et _Contact_, c'est que ça marche! Cool! "Empty" signifie simplement que vous n'avez aucun article enregistré dans votre base de données. Allez simplement sur `/admin/posts` pour en créer quelques-un, puis revenez sur la page d'accueil de votre application pour les voir s'afficher.

> Si vous regardez le déploiement via le bouton **Preview**, remarquez que l'URL contient un hash du dernier commit. Netlify va en créer un à chaque nouveau push sur la branche `main` mais ne montrera que ce commit. Donc si vous déployez à nouveau en executant un refresh, vous ne verrez aucune modification. L'URL de déploiement de votre site (celle que vous obtenez depuis la page d'accueil de Netlify) affichera toujours le dernier déploiement. Consultez la section suivante "[Déploiement de Branche](#branch-deploys)" pour plus d'informations.

Si votre déploiement n'a pas fonctionné, consultez le log dans Netlify et voyez si vous comprenez l'erreur qui s'affiche. Si votre déploiement s'esst correctement effectué mais que le site ne s'affiche pas, essayez d'ouvrir les outils de développement de votre navigateur afin de voir si des erreurs s'affichent. Assurez-vous également de bien avoir copié _en totalité_ l'URI de connection Postgres depuis Heroku. Si véritablement vous ne parvenez pas à trouver d'où vient l'erreur, demandez-donc de l'aide à la [communauté Redwood](https://community.redwoodjs.com).

### Déploiements de Branche

Une autre fonctionnalité bien pratique de Netlify est appelée _branch deploys_. Lorsque vous créez une branche et effectuez un push sur votre dépôt Git, Netlify va contruire votre application depuis cette branche et vous retourner une URL unique de telle manière que vous puissiez tester vos modifications tout en laissant intacte le déploiement effectué depuis la branche `main`. Une fois que votre branche alternative a été _merged_ dans la branche `main`, une nouvelle construction de votre application sera effectuée en prenant en compte les modifications apportées par la branche alternative. Pour activer le déploiement de branches, allez dans **Settings**>**Continuous Deployment** puis sous la section **Deploy context** cliquez sur **Edit Settings** et modifiez **Branch Deploys** to "All". Vous pouvez également activer _Deploy previews_ qui va créer une préview pour toute _pull-request_ effectuée sur votre dépôt.

![Netlify settings screenshot](https://user-images.githubusercontent.com/30793/90886476-c1016780-e3b2-11ea-851a-3014257484fd.png)

> Vous avez également la possibilité de "vérouiller" la branche `main` de telle manière que chaque push ne déclanche pas automatiquement une reconstruction de l'application. Vous devez alors demander à Netlify manuellement de déployer la dernière version présente sur le dépôt, soit en vous rendant sur le site, soit en utilisant [la CLI Netlify](https://cli.netlify.com/).

### Une remarque à propos des connections aux bases de données

Dans ce didacticiel, vos fonctions lambda vont se connecter directement à la base Postgres. Dans la mesure où Postgres à un nombre limité de connections concurrentes possibles, son utilisation peut devenir problématique lorsque le nombre d'utlisateurs croît énormément. La bonne solution est de mettre en place un service de "connection pooling" devant Postgres et y connecter vos fonctions lambda. Pour apprendre comment faire ça, consulter le [guide associé](https://www.redwoodjs.com/docs/connection-pooling).
