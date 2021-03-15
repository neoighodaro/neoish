---
slug: "5-forcing-only-json-responses-laravel"
title: "Forcing JSON-only responses in Laravel"
seo_title: "Forcing JSON-only responses in Laravel"
image: "https://neoish.s3-eu-west-1.amazonaws.com/5-forcing-only-json-responses-laravel/code.png"
description: "When building an API pmly service in Laravel you might want to force JSON only responses"
date: "2021-03-14 12:31:00"
reading_minutes: 1
tags: laravel, api
---

In a case where you are trying to use Laravel as the framework for an API-only backend, you might want to force returning JSON responses.

This can be useful because if the client does not specify the `Accept: application/json` header in the request, Laravel will return a HTML response for things like validation errors.

If you would like to force JSON only responses, you should create a [global middleware](https://laravel.com/docs/master/middleware#global-middleware) and register it. Here's an example of the middleware:

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

With this, you requests will always return JSON responses. Of course this still depends on returning actual JSON in the response of your controller.
