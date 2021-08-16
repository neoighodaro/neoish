---
slug: "8-dynamically-loading-components-in-vuejs"
title: "Dynamically Loading VueJS Components"
seo_title: "Dynamic Relationships in Laravel using Eloquent Macros"
image: "https://user-images.githubusercontent.com/807318/129602894-3cb1f7ff-0714-42fd-a2f3-3d62d6fbf695.jpeg"
description: "In this article, I will show how you can dynamically load components using webpacks codesplitting"
date: "2021-08-16 18:50:00"
reading_minutes: 4
tags: vuejs, components, dynamic loading
---

When working on a VueJS application, there might be times when you might need to dynamically load components based on some logic.

In cases like these, you might reach for the normal way of loading components:

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

While there is nothing really wrong with this pattern, you can see that the template will continue to get bloated the more conditions we have. We can do it a bit differently and potentially better.

## Loading Components Dynamically

Let's try to do the same thing using a different pattern. Using [Webpack code splitting](https://webpack.js.org/guides/code-splitting/), we can dynamically import our Vue components. Here is an example:

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

While this is just a different way to do things, we would benefit from Webpack's code splitting and also move all the conditions to the script block instead of the template block.

Something to note is, Webpack will public (on build) all the files in the `@sample/package` directory by default as chunks to your output directory. So if there are, say, 900 files, all 900 files will be published.

To avoid this, we can specify stricter filters for the import using [Webpack's magic comments](https://webpack.js.org/api/module-methods/#magic-comments).