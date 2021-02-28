---
slug: "4-little-sail-an-alpine-base-for-laravel-sail"
title: "Little Sail: alpine-based images for Laravel Sail"
seo_title: "Little Sail: alpine-based images for Laravel Sail"
image: "https://neoish.s3-eu-west-1.amazonaws.com/4-little-sail-an-alpine-base-for-laravel-sail/little-sail.jpeg"
description: "Introducing little sail. An alpine-based replacement for the Laravel Sail docker runtime image"
date: "2021-02-28 17:39:00"
reading_minutes: 3
tags: laravel, docker, alpine, sail
---

In my last article, it was clear I got the Apple M1 and I started using it for development. Laravel is my usual go to framework while developing and Laravel now has a little optional Docker development machine that can be added to it called [Sail](https://laravel.com/docs/sail).

After [getting the M1 to work with Docker](https://neoighodaro.com/posts/3-running-laravel-and-docker-on-the-apple-mac-m1) I started using Sail and I quickly noticed the base image for the PHP runtime was over 600mb. As someone with a low storage Mac, I don't think I want to be giving Docker this much space to keep an image.

![Terminal Laravel Sail alpine](https://user-images.githubusercontent.com/807318/109423532-1365b580-79e0-11eb-955f-9cd51fe661f1.png)

So I decided to make [Little Sail](https://github.com/neoighodaro/little-sail). It is basically a drop-in replacement for the current Laravel Sail image runtime. ~~Currently it only supports PHP 8.0 but I think this will change very soon as I think it should not be too hard to have an identical image for the 7.4 version of PHP (feel free to submit a PR).~~ PHP 7.4 is now supported.

Anyway, it is available for use now and you can report any bugs or send PRs if you think it could be better somehow. I guess the next thing to add ~~to the package will be PHP 7.4 and~~ smaller MySQL images.
