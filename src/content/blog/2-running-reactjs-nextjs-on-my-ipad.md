---
slug: "2-running-reactjs-nextjs-on-my-ipad"
title: "Running ReactJS and Deploying from my iPad"
seo_title: "Running ReactJS, NextJS on my iPad"
image: "https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598510827836_AE5EB548-77A2-4942-B0CE-409FDC8A4872.png"
image_width: 2732
image_height: 2048
description: "In this article, I explain how I managed to run ReactJS and deploy it from just the iPad."
date: "2020-08-27 08:20:00"
reading_minutes: 5
tags: reactjs, nextjs, deployment, development
---

Before this redesign, I had had my personal blog rocking the same design for over 4 years. That's a very long time ago. The good ol' days where we could gather in groups and shake hands to our hearts desire.

Anyway, I digress.

Since I got my iPad Pro 2018, I have been looking for ways to convert it into my secondary development machine. I have since then created wireframes, run a local server on the iPad using Raspberry Pi, and more just from the iPad. Now, I decided to redevelop my personal site on the iPad.

## Choosing a technology

First, I had to choose a technology. What I wanted primarily was speed and ease of development and deployment. So after considering various options like [Gatsby](https://www.gatsbyjs.com), [Hugo](https://gohugo.io), [Statamic](https://statamic.com), I decided to go with something simple. My own CRUD set up using [NextJS](https://nextjs.org).

So after choosing my technology, I decided to go with a simple design. I looked for some sites that did something close to what I wanted and built using those inspirations.

## Creating a development workflow on the iPad

Unlike traditional desktop computers, when attempting to develop for the iPad, you have to think of a good workflow. This is because, unlike my Mac where I have one command line and every thing flows through there, I have to use dedicated apps for the iPad.

Yes, there are command-line apps for the iPad like Blink, which I use, but they are mostly used to connect to remote servers and thus are useless for this specific task.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598513644789_D4690C3C-89EB-424E-A1DC-D76B9A0AB62C.gif)

**Finding a suitable text editor**
The first thing I wanted to find was a good text editor. With this, I would be able to code on the iPad. There are many options when it comes to this on the iPad. Before today, I already had a few. The one of which I used the most was [DraftCode](https://solesignal.com/draftcode/).

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598510827836_AE5EB548-77A2-4942-B0CE-409FDC8A4872.png)

The problem with DraftCode though is, it is primarily built for running PHP on the iPad locally. As a side note, if you are using DraftCode, you will quickly realise how hard it is to work with composer as the app itself does not do anything composer related. I will write an article on how I created a [Composer alternative for the iPad](https://cmpsr.co) that I then use with my DraftCode.

Another text editor I had was [Code Editor](https://panic.com/code-editor/). This was more generic and could work with JavaScript files on your iPad pretty well. You could also connect to remote servers and update the files from the code editor.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598511305962_91BE2DCB-7148-4E0B-9FB4-66ACAD600C8C.png)

The problem with the code editor though is the compiling of JavaScript assets. Unfortunately, if I wanted to use it, I would have no way to preview changes especially on the JavaScript side.

Finally, i found [Play.js](https://playdotjs.com/). This is an iPad application that is built especially for my use case. It has an integrated editor, git support, running npm scripts, and more. With this power, I was able to run a full NextJS application on my iPad.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598512906014_96CE9F05-CEC1-4B08-BD63-A9E275DDBC5C.gif)

We found a winner.

## Hosting and Deployment

Well technically this was the easiest decision I made. I already know of how awesome it is to use [Netlify](https://netlify.com). All I needed to do was add the `netlify.toml` file, and make a few changes and it was ready to be deployed.

Though the play.js application comes with itâ€™s own Git client, I actually preferred using [Working Copy](https://workingcopyapp.com) which is a dedicated git client for the iPad.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598513367606_022839DC-4930-436D-A3DC-0C5EF330F9E0.png)

Ignore the commit messages :P

After setting up my Netlify and Git, I could then develop and commit and for every push, there is a Netlify build which is deployed automatically.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598514003196_F50C488A-1A89-4F17-8E66-5162E7F2C955.jpeg)

## Conclusion

This was a fun experiment creating an entirely functioning application directly from the iPad. Currently, like I said earlier, I connected my Raspberry Pi using USB-C to the iPad. This allows me to use the Pi as an ethernet provider.

With this power, I am able to run a local server on the Raspberry Pi and then view the local URL using the static URL on my iPad. This was I have been able to continue working on my personal project running Laravel all on my iPad.

I can just SSH into the local Pi server using Blink and then run all the commands I need. For file management, I also set the Raspberry Pi as a SMB server. I can then connect to the Pi using the native Files app on the iPad.

Perhaps I will write about this soon as well.

The source code is not public yet but I am sure that at some point I will make it so.
