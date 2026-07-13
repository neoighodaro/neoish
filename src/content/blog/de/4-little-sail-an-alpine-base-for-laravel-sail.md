---
slug: "4-little-sail-an-alpine-base-for-laravel-sail"
title: "Little Sail: Alpine-basierte Images für Laravel Sail"
seo_title: "Little Sail: Alpine-basierte Images für Laravel Sail"
image: "https://neoish.s3-eu-west-1.amazonaws.com/4-little-sail-an-alpine-base-for-laravel-sail/little-sail.jpeg"
image_width: 1000
image_height: 667
description: "Ich stelle Little Sail vor: ein Alpine-basierter Ersatz für das Laravel Sail Docker-Runtime-Image"
date: "2021-02-28 17:39:00"
reading_minutes: 3
tags: laravel, docker, alpine, sail
---

In meinem letzten Artikel war es schon deutlich: Ich habe das Apple M1 bekommen und nutze es für die Entwicklung. Laravel ist mein bevorzugtes Framework, und Laravel bietet mittlerweile eine optionale Docker-Entwicklungsumgebung namens [Sail](https://laravel.com/docs/sail).

Nachdem ich [das M1 mit Docker zum Laufen gebracht hatte](https://neoighodaro.com/posts/3-running-laravel-and-docker-on-the-apple-mac-m1), begann ich Sail zu nutzen – und bemerkte schnell, dass das Basis-Image für die PHP-Laufzeit über 600 MB groß ist. Da mein Mac nur wenig Speicher hat, möchte ich Docker nicht so viel Platz für ein einziges Image geben.

![Terminal Laravel Sail alpine](https://user-images.githubusercontent.com/807318/109423532-1365b580-79e0-11eb-955f-9cd51fe661f1.png)

Also habe ich [Little Sail](https://github.com/neoighodaro/little-sail) erstellt. Es ist im Grunde ein Drop-in-Ersatz für das aktuelle Laravel Sail Runtime-Image. ~~Aktuell wird nur PHP 8.0 unterstützt, aber ich denke, das wird sich bald ändern – ein identisches Image für PHP 7.4 sollte nicht schwer umzusetzen sein (Pull Requests sind willkommen).~~ PHP 7.4 wird jetzt unterstützt.

Das Paket steht zur Nutzung bereit. Bugs kannst du gerne melden oder PRs einreichen, falls du Verbesserungen siehst. Das Nächste auf der Liste wäre wohl ~~die Unterstützung von PHP 7.4 und~~ kleinere MySQL-Images.
