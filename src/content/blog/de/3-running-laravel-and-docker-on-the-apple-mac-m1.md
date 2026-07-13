---
slug: "3-running-laravel-and-docker-on-the-apple-mac-m1"
title: "Laravel mit Docker auf dem Apple M1 Mac ausführen"
seo_title: "Laravel mit Docker auf dem Apple M1 Mac ausführen"
image: "https://neoish.s3-eu-west-1.amazonaws.com/3-running-laravel-and-docker-on-the-apple-mac-m1/markos-mant-0nKRq0IknHw-unsplash.jpg"
image_width: 1000
image_height: 664
description: "In diesem Artikel zeige ich, wie ich Laravel, Docker und MySQL auf dem Apple M1 Mac betreibe."
date: "2021-02-22 18:49:00"
reading_minutes: 3
tags: laravel, docker, apple, m1, mac
---

Kürzlich habe ich das Apple MacBook Pro mit dem M1-Chip bekommen. Natürlich wollte ich sofort anfangen, darauf zu entwickeln. Da der M1 jedoch noch recht neu ist, funktionieren einige der Dienste und Anwendungen, die ich benötige, auf dem M1 nicht richtig.

Ich dachte, ich teile, wie ich meine Laravel-Entwicklungsumgebung auf dem Apple M1 Mac eingerichtet habe.

Für mich ist der schnellste Weg, Docker zu verwenden. Zum Zeitpunkt des Schreibens hat Docker eine [Preview-Version](https://docs.docker.com/docker-for-mac/apple-m1/), die gut für den M1 Mac funktioniert.

Wenn Docker installiert ist, kannst du mit den folgenden Schritten weitermachen:

### Laravel-Anwendung installieren

Um deine Anwendung zu erstellen, führe folgenden Befehl aus:

```shell
$ curl -s https://laravel.build/sample-app | bash # Change "sample-app"
```

> 💡 **Hinweis**: Dieser Artikel basiert auf Laravel 8

Deine neue Anwendung enthält eine Kopie von Laravel Sail. Laut [Dokumentation](https://laravel.com/docs/8.x/sail#introduction) ist "Laravel Sail eine leichtgewichtige Kommandozeilenschnittstelle für die Interaktion mit Laravels Standard-Docker-Entwicklungsumgebung. Sail bietet einen großartigen Einstiegspunkt für das Erstellen einer Laravel-Anwendung mit PHP, MySQL und Redis, ohne dass vorherige Docker-Kenntnisse erforderlich sind."

### MySQL zum Laufen bringen

Leider funktioniert MySQL zum Zeitpunkt des Schreibens dieses Artikels nicht für die ARM-Architektur des M1. Um das zu umgehen, musst du die `docker-compose.yml`-Datei bearbeiten, die in der Anwendung enthalten ist.

Füge `platform: 'linux/x86_64'` zur `mysql`-Dienstkonfiguration hinzu, wie unten gezeigt:

```yaml
services:
  mysql:
    image: 'mysql:8.0'
    platform: 'linux/x86_64'
    ...
```

Das Hinzufügen dieser Zeile bewirkt, dass Docker die `linux/x86_64`-Architektur emuliert. Diese Emulation kann MySQL verlangsamen, besonders bei größeren Datenbanken. Ich persönlich habe lokal keine großen Datenbanken und habe daher keine Probleme mit der Datenbankgeschwindigkeit.

### Laravel-Anwendung starten

Um deine Laravel-Anwendung zu starten, musst du mit `cd` in das Anwendungsverzeichnis wechseln und folgenden Befehl ausführen, um die Docker-Container zu starten:

```shell
$ ./vendor/bin/sail up
```

Der erste Build dauert etwas länger, aber danach werden die folgenden Builds schneller sein. Wenn er fertig ist, geh zu http://localhost.
