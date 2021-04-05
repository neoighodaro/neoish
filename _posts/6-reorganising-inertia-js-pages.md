---
slug: "6-reorganising-inertia-js-pages"
title: "Reorganising Pages in Inertia JS"
seo_title: "Reorganising Pages in Inertia JS"
image: "https://neoish.s3-eu-west-1.amazonaws.com/6-reorganising-inertia-js-pages/lachlan-donald-YVT5aF2QM7M-unsplash.jpeg"
description: "If you have ever wanted to reorganise pages while using Inertia JS then read on"
date: "2021-04-04 15:57:00"
reading_minutes: 1
tags: inertiajs, javascript
---

Recently I started using [Inertia JS](https://inertiajs.com/) in a project and I had to change how pages were loaded. If you have used Inertia JS, you would already know that by default on the client side, [pages are loaded from the Pages directory](https://inertiajs.com/client-side-setup#initialize-app).

However, I had a use case that was not very easy to work with initially. The use case was simple, I had an application that I wanted to be extendable by packages. In other words, I wanted packages to be able to supply their own Inertia Pages and they should also be loaded by Inertia on the main application.

Turns out figuring something like this out was actually not that complicated. In the example written in the documentation, you can see something like this:

> This example assumes you are using Vue JS version 3, but the same principle applies for other supported frameworks

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

If you look at the `render` method, there is a `resolveComponent` property which is set to an anonymous function. This is the function that instructs Inertia JS on where to look for the requested page. With a little imagination, we can set this to look for pages where we want.

Here's an example:

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

Above, we can see that the resolve component does a little more work. Now if you try to load an Inertia page using `@CustomModule::User/Index` it will match `@CustomModule::` to mean, load `CustomModule/Pages/User/Index.vue` module from the `./Modules` directory. Inertia will of course work the normal way if you don't wrap the `@` and `::` in the page name.

With this we can have a controller that does something like this:

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

Of course, you can modify it to load directly from your `vendor` directory for PHP applications, but that decision is yours to make. With the above, I was able to support custom packages supplying Inertia JS pages without having to really hack Inertia JS.
