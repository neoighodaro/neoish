---
slug: "6-reorganising-inertia-js-pages"
title: "Pages in Inertia JS neu organisieren"
seo_title: "Pages in Inertia JS neu organisieren"
image: "https://neoish.s3-eu-west-1.amazonaws.com/6-reorganising-inertia-js-pages/lachlan-donald-YVT5aF2QM7M-unsplash.jpeg"
image_width: 1000
image_height: 625
description: "Wenn du Pages in Inertia JS neu organisieren möchtest, zeige ich dir wie es geht"
date: "2021-04-04 15:57:00"
reading_minutes: 1
tags: inertiajs, javascript
---

Kürzlich habe ich [Inertia JS](https://inertiajs.com/) in einem Projekt eingesetzt und musste anpassen, wie Pages geladen werden. Wer Inertia JS bereits kennt, weiß, dass Pages auf der Client-Seite standardmäßig [aus dem Pages-Verzeichnis geladen werden](https://inertiajs.com/client-side-setup#initialize-app).

Ich hatte jedoch einen Anwendungsfall, der anfangs nicht ganz einfach zu lösen war. Das Szenario war eigentlich simpel: Ich hatte eine Anwendung, die durch Pakete erweiterbar sein sollte. Das heißt, Pakete sollten eigene Inertia Pages mitbringen können, die dann ebenfalls von Inertia in der Hauptanwendung geladen werden.

Wie sich herausstellte, war die Lösung gar nicht so kompliziert. Im Beispiel der Dokumentation sieht man etwas wie dieses:

> Dieses Beispiel setzt Vue JS Version 3 voraus, das gleiche Prinzip gilt aber auch für andere unterstützte Frameworks

```javascript
import { createApp, h } from "vue";
import { App, plugin } from "@inertiajs/inertia-vue3";

const el = document.getElementById("app");

createApp({
  render: () =>
    h(App, {
      initialPage: JSON.parse(el.dataset.page),

      /* Pay attention to here */
      resolveComponent: (name) => require(`./Pages/${name}`).default,
    }),
})
  .use(plugin)
  .mount(el);
```

Schaut man sich die `render`-Methode an, gibt es eine `resolveComponent`-Eigenschaft, die auf eine anonyme Funktion gesetzt ist. Diese Funktion teilt Inertia JS mit, wo es nach der angeforderten Page suchen soll. Mit etwas Fantasie können wir sie so konfigurieren, dass Pages von einem beliebigen Ort geladen werden.

Hier ein Beispiel:

```javascript
// ...

const el = document.getElementById("app");

createApp({
  render: () =>
    h(InertiaApp, {
      // ...

      resolveComponent(name) {
        const matched = /@(.*)::/.exec(name);

        if (matched === null) {
          return require(`./Pages/${name}`).default;
        }

        const module = matched[1];
        const pageName = name.replace(matched[0], "");

        return require(`./Modules/${module}/Pages/${pageName}`).default;
      },
    }),
});
// ...
```

Hier erledigt `resolveComponent` etwas mehr Arbeit. Wenn du nun versuchst, eine Inertia Page mit `@CustomModule::User/Index` zu laden, wird `@CustomModule::` so interpretiert: Lade `CustomModule/Pages/User/Index.vue` aus dem `./Modules`-Verzeichnis. Ohne das `@`- und `::`-Muster im Page-Namen funktioniert Inertia ganz normal wie gewohnt.

Damit kann ein Controller zum Beispiel so aussehen:

```php
<?php

// ...

use Inertia;

class UserController extends Controller
{
    public function index(): Inertia\Response
    {
        return Inertia\Inertia::render('@CustomModule::User/Index');
    }

    // ...
}
```

Natürlich kannst du das Ganze auch so anpassen, dass Pages direkt aus deinem `vendor`-Verzeichnis für PHP-Anwendungen geladen werden – das bleibt dir überlassen. Mit dieser Lösung konnte ich Pakete mit eigenen Inertia JS Pages unterstützen, ohne Inertia JS selbst anpassen zu müssen.
