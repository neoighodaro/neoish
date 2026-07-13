---
slug: "9-dynamically-loading-components-in-vuejs"
title: "Vue.js-Komponenten dynamisch laden"
seo_title: "Vue.js-Komponenten dynamisch laden"
image: "https://user-images.githubusercontent.com/807318/129602894-3cb1f7ff-0714-42fd-a2f3-3d62d6fbf695.jpeg"
image_width: 1671
image_height: 754
description: "In diesem Artikel zeige ich, wie du Komponenten mit Webpacks Code-Splitting dynamisch laden kannst."
date: "2021-08-16 18:50:00"
reading_minutes: 4
tags: vuejs, components, dynamic loading
---

Beim Arbeiten mit einer Vue.js-Anwendung kommt es vor, dass du Komponenten abhängig von einer bestimmten Logik dynamisch laden musst.

In solchen Fällen greift man oft zur gewohnten Variante:

```js
<template>
  <foo-component v-if="loadComponent === 'foo'" />
  <bar-component v-else-if="loadComponent === 'bar'" />
  <baz-component v-else />
</template>

<script>
import { FooComponent, BarComponent, BazComponent } from '@sample/package'

export default {
  components: {
    FooComponent,
    BarComponent,
    BazComponent,
  },

  props: ['loadComponent'],
}
</script>
```

An diesem Muster ist grundsätzlich nichts falsch, aber man sieht: Je mehr Bedingungen hinzukommen, desto unübersichtlicher wird das Template. Es gibt einen eleganteren Weg.

## Komponenten dynamisch laden

Versuchen wir dasselbe mit einem anderen Ansatz. Mithilfe von [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/) können wir Vue-Komponenten dynamisch importieren. Hier ein Beispiel:

```js
<template>
  <component :is="loadedComponent" />
</template>

<script>
export default {
  props: ['loadComponent'],

  computed: {
    loadedComponent() {
      let component = 'BazComponent'

      if (this.loadComponent === 'foo') {
        component = 'FooComponent'
      } else if (this.loadComponent === 'bar') {
        component = 'BarComponent'
      }

      return defineAsyncComponent(() => import(`@sample/package/${component}`))
    }
  }
}
</script>
```

Das ist zwar nur eine andere Herangehensweise, aber wir profitieren dabei vom Code Splitting in Webpack und verlagern alle Bedingungen vom Template- in den Script-Block.

Wichtig zu wissen: Webpack veröffentlicht beim Build standardmäßig alle Dateien im Verzeichnis `@sample/package` als separate Chunks in deinem Ausgabeverzeichnis. Bei 900 Dateien werden also auch 900 Dateien ausgegeben.

Um das zu vermeiden, kannst du den Import mit [Webpacks Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments) gezielt einschränken.
