---
slug: "5-forcing-only-json-responses-laravel"
title: "Nur JSON-Antworten in Laravel erzwingen"
seo_title: "Nur JSON-Antworten in Laravel erzwingen"
image: "https://neoish.s3-eu-west-1.amazonaws.com/5-forcing-only-json-responses-laravel/code.png"
image_width: 1000
image_height: 504
description: "Wenn du Laravel als reines API-Backend verwendest, kannst du erzwingen, dass ausschließlich JSON-Antworten zurückgegeben werden"
date: "2021-03-14 12:31:00"
reading_minutes: 1
tags: laravel, api
---

Wenn du Laravel als Framework für ein reines API-Backend nutzt, möchtest du vielleicht sicherstellen, dass immer JSON-Antworten zurückgegeben werden.

Das ist sinnvoll, weil Laravel – falls der Client keinen `Accept: application/json`-Header im Request mitschickt – bei Validierungsfehlern und ähnlichem eine HTML-Antwort zurückliefert.

Um ausschließlich JSON-Antworten zu erzwingen, solltest du eine [globale Middleware](https://laravel.com/docs/master/middleware#global-middleware) erstellen und registrieren. Hier ist ein Beispiel:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAcceptJsonRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
```

Damit werden deine Requests immer JSON-Antworten zurückliefern. Das setzt natürlich voraus, dass dein Controller tatsächlich JSON zurückgibt.
