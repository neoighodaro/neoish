---
slug: "8-dynamic-model-relationships-using-macros-in-laravel"
title: "Dynamische Beziehungen in Laravel mit Eloquent-Macros"
seo_title: "Dynamische Beziehungen in Laravel mit Eloquent-Macros"
image: "https://user-images.githubusercontent.com/807318/126615836-4dec5404-709a-4d7b-8963-9084114feac8.png"
image_width: 2372
image_height: 776
description: "Eloquent-Macros sind eine elegante Möglichkeit, Laravel-Models zu erweitern. In diesem Beitrag definieren wir Beziehungen außerhalb der Model-Klasse."
date: "2021-07-22 11:02:00"
reading_minutes: 1
tags: laravel, eloquent, macros
---

[Laravel-Eloquent-Macros](https://www.larashout.com/laravel-macros-extending-laravels-core-classes) sind eine hervorragende Möglichkeit, einige der Core-Klassen von Laravel zu erweitern. Mit Macros lässt sich ein Laravel-Model um Beziehungen ergänzen, die nicht direkt in der Model-Klasse selbst definiert sind.

Hier ist ein Beispiel, wie das funktioniert:

```php
// Add to the boot() method of the AppServiceProvider
Builder::macro('warehouses', function () {
  return $this->getModel()->hasManyThrough(
    ShareholderWarehouse::class,
    City::class,
    'state_id',
    'city_id'
  );
});
```

Damit steht die `warehouses`-Beziehung in allen deinen Models zur Verfügung. Du kannst natürlich weitere Logik hinzufügen — aber dies ist bereits ein guter Ansatz, um Model-Beziehungen dynamisch zu ergänzen.
