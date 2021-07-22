---
slug: "7-dynamic-model-relationships-using-macros-in-laravel"
title: "Dynamic Relationships in Laravel using Eloquent Macros"
seo_title: "Dynamic Relationships in Laravel using Eloquent Macros"
image: "https://user-images.githubusercontent.com/807318/126615836-4dec5404-709a-4d7b-8963-9084114feac8.png"
description: "Eloquent Macros are a good way to extend the functionality of your Laravel model. In this case, we will define relationships outside the model class"
date: "2021-07-22 11:02:00"
reading_minutes: 1
tags: laravel, eloquent, macros
---

[Laravel Eloquent macros](https://www.larashout.com/laravel-macros-extending-laravels-core-classes) are a great way of extending some of Laravel's core classes. Using macros, we can extend a Laravel model to have certain relationships that have not been defined on the model class itself.

Here is an example on how to do this:

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

Now all your models will have the `warehouses` relationship. You can add more logic ofcourse, but this is a good way to dynamically add model relationships.