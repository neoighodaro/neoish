---
slug: "12-changing-xcode-header-comment-templates-fileheader"
title: "Den Xcode Datei-Header-Kommentar ändern"
seo_title: "Den Xcode Datei-Header-Kommentar ändern"
image: "/img/blog/xcode.webp"
image_width: 1400
image_height: 527
description: "Den Datei-Header-Kommentar für Swift-Dateien in Xcode anpassen – über die FILEHEADER-Variable in den Templates"
date: "2023-08-23 10:48:00"
reading_minutes: 1
tags: xcode, swift, fileheader, xcode templates
---

Wer schon einmal versucht hat, den Standard-Header einer Swift-Datei in Xcode zu ändern, wird festgestellt haben, dass das alles andere als intuitiv ist – Apple erklärt es nicht, und noch ärgerlicher: Bei jedem Xcode-Update wird das Templates-Verzeichnis überschrieben.

Mir gefallen die Standard-Templates von Xcode überhaupt nicht, also habe ich ein Bash-Skript geschrieben, das den größten Teil der Arbeit automatisch erledigt.

Das GitHub-Repo findest du [hier](https://github.com/neoighodaro/xctemplates).

Das Skript nutzt den `find`-Befehl, um alle Templates im Xcode-Anwendungspaket zu finden. Anschließend ersetzt es den Header jedes Templates durch den von dir angegebenen Header. Außerdem legt das Skript eine Sicherungskopie der originalen Template-Dateien an, falls du zum ursprünglichen Zustand zurückkehren möchtest. Das Backup wird unter `~/xctemplates_backup` gespeichert. In diesem Verzeichnis findest du auch die geänderten Dateien für jedes Backup – praktisch, wenn du nachvollziehen möchtest, welche Dateien angepasst wurden.

Sollte etwas schiefgehen, kannst du die originalen Templates jederzeit manuell wiederherstellen, da das Skript selbst keine Wiederherstellungsfunktion bietet.

In der [Xcode-Hilfe zu einigen Makros](https://help.apple.com/xcode/mac/9.0/index.html?localePath=en.lproj#/dev7fe737ce0) findest du weitere Informationen.
