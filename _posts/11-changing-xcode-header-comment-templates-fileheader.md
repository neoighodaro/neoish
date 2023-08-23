---
slug: "11-changing-xcode-header-comment-templates-fileheader"
title: "Changing XCode File Header Comment"
seo_title: "Changing XCode File Header Comment"
image: "https://github.com/neoighodaro/neoish/assets/807318/977128be-4e40-4833-b3cf-1cd09c9b718a"
image_width: 3024
image_height: 1138
description: "Change the file header comment for youe Swift files in Xcode by customising the FILEHEADER"
date: "2023-08-23 10:48:00"
reading_minutes: 1
tags: xcode, swift, fileheader, xcode templates
---

If you have ever tried to change the standard header of an Xcode swift file, you would find that it's a little unintuitive as Apple does not really tell you how to, and even worse, every time you update Xcode, the templates directory gets overwritten.

I definitely do not like the default templates Xcode provides, so I wrote a bash script to help me do most of the hard work automatically.

You can find the Github repo [here](https://github.com/neoighodaro/xctemplates).

This script uses the find command to find all the templates in the Xcode application bundle. It then replaces the header of each template with the header you provide. The script also creates a backup of the original template files in case you want to revert back to the original templates. The back up is stored in ~/xctemplates_backup. In this directory, you can also find the modified files for each backup. This is useful if you want to see what files were modified.

If something goes wrong, you can always restore the original templates manually as the script does not have the ability to restore the templates.

You can see the [Xcode help for some macros](https://help.apple.com/xcode/mac/9.0/index.html?localePath=en.lproj#/dev7fe737ce0).
