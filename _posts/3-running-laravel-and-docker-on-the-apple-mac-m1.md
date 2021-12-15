---
slug: "3-running-laravel-and-docker-on-the-apple-mac-m1"
title: "Running Laravel in Docker on the Apple M1 Mac"
seo_title: "Running Laravel in Docker on the Apple M1 Mac"
image: "https://neoish.s3-eu-west-1.amazonaws.com/3-running-laravel-and-docker-on-the-apple-mac-m1/markos-mant-0nKRq0IknHw-unsplash.jpg"
image_width: 1000
image_height: 664
description: "In this article, I will show how I run Laravel, Docker, and MySQL on the Apple M1 Mac"
date: "2021-02-22 18:49:00"
reading_minutes: 3
tags: laravel, docker, apple, m1, mac
---

Recently got the Apple MacBook Pro with the m1 chip. Of course, I wanted to immediately start developing on it. However, since the m1 is fairly new, some of the services and applications I need do not work properly on the m1.

I thought I should share how I set up my Laravel development environment on the Apple M1 Mac.

To me, the fastest way to get started is using Docker. As of the time of writing this, Docker has a [preview version](https://docs.docker.com/docker-for-mac/apple-m1/) that works well for the M1 Mac.

When you have Docker installed, you can continue with the following steps:

### Install your Laravel application

To create your application, run the following command:

```shell
$ curl -s https://laravel.build/sample-app | bash # Change "sample-app"
```

> 💡 **Note**: This article is based on Laravel 8

Your new application will contain a copy of Laravel Sail. “Laravel Sail is a light-weight command-line interface for interacting with Laravel's default Docker development environment. Sail provides a great starting point for building a Laravel application using PHP, MySQL, and Redis without requiring prior Docker experience.” according to [documentation](https://laravel.com/docs/8.x/sail#introduction).

### Making MySQL work

Unfortunately, as of the time of writing this article, MySQL does not work for the arm architecture of the M1. To get past this you will have to edit the `docker-compose.yml` file that is bundled in the application.

Add `platform: 'linux/x86_64'` to the `mysql` service configuration as shown below:

```yaml
services:
  mysql:
    image: 'mysql:8.0'
    platform: 'linux/x86_64'
    ...
```

Adding this line means Docker will emulate the `linux/x86_64` architecture. This emulation might make MySQL slower especially for bigger databases. I personally do not have big databases locally and thus I don’t have any issues with the database speed.

### Running your Laravel application

To run your Laravel application, you need to `cd` to the applications directory and run the following command to start the docker containers:

```shell
$ ./vendor/bin/sail up
```

The initial build will take a bit but after that subsequent builds will be faster. When it’s done, go to http://localhost.
