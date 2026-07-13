---
slug: "2-running-reactjs-nextjs-on-my-ipad"
title: "ReactJS auf dem iPad ausführen und deployen"
seo_title: "ReactJS und NextJS auf dem iPad ausführen"
image: "https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598510827836_AE5EB548-77A2-4942-B0CE-409FDC8A4872.png"
image_width: 2732
image_height: 2048
description: "In diesem Artikel erkläre ich, wie es mir gelungen ist, ReactJS auf dem iPad auszuführen und von dort aus zu deployen."
date: "2020-08-27 08:20:00"
reading_minutes: 5
tags: reactjs, nextjs, deployment, development
---

Vor diesem Redesign hatte mein persönlicher Blog über 4 Jahre lang dasselbe Design. Das ist eine sehr lange Zeit. Die guten alten Tage, als wir uns noch in Gruppen treffen und nach Herzenslust die Hände schütteln konnten.

Aber ich schweife ab.

Seit ich mein iPad Pro 2018 habe, suche ich nach Wegen, es in meine zweite Entwicklungsmaschine zu verwandeln. Seitdem habe ich Wireframes erstellt, einen lokalen Server auf dem iPad mit dem Raspberry Pi betrieben und noch mehr – alles vom iPad aus. Jetzt habe ich beschlossen, meine persönliche Website auf dem iPad neu zu entwickeln.

## Technologie wählen

Zunächst musste ich eine Technologie wählen. Was mir in erster Linie wichtig war, waren Geschwindigkeit und einfache Entwicklung und Deployment. Nach dem Abwägen verschiedener Optionen wie [Gatsby](https://www.gatsbyjs.com), [Hugo](https://gohugo.io) und [Statamic](https://statamic.com) entschied ich mich für etwas Schlichtes: ein eigenes CRUD-Setup mit [NextJS](https://nextjs.org).

Nachdem ich meine Technologie gewählt hatte, entschied ich mich für ein simples Design. Ich schaute mir einige Seiten an, die in eine ähnliche Richtung gingen, und ließ mich davon inspirieren.

## Einen Entwicklungs-Workflow auf dem iPad aufbauen

Anders als bei traditionellen Desktop-Computern muss man beim Entwickeln auf dem iPad einen guten Workflow durchdenken. Das liegt daran, dass ich auf meinem Mac eine einzige Kommandozeile habe, durch die alles läuft – auf dem iPad muss ich dagegen auf dedizierte Apps zurückgreifen.

Ja, es gibt Kommandozeilen-Apps für das iPad wie Blink, die ich auch nutze, aber sie dienen hauptsächlich dazu, sich mit Remote-Servern zu verbinden, und sind für diese spezifische Aufgabe daher nutzlos.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598513644789_D4690C3C-89EB-424E-A1DC-D76B9A0AB62C.gif)

**Einen geeigneten Texteditor finden**
Das Erste, wonach ich gesucht habe, war ein guter Texteditor. Damit könnte ich auf dem iPad programmieren. Es gibt viele Optionen dafür auf dem iPad. Schon vorher hatte ich einige davon. Den ich am häufigsten genutzt habe, war [DraftCode](https://solesignal.com/draftcode/).

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598510827836_AE5EB548-77A2-4942-B0CE-409FDC8A4872.png)

Das Problem mit DraftCode ist jedoch, dass es in erster Linie dafür gebaut wurde, PHP lokal auf dem iPad auszuführen. Als Randnotiz: Wer DraftCode nutzt, wird schnell merken, wie schwierig es ist, mit Composer zu arbeiten, da die App selbst nichts Composer-bezogenes tut. Ich werde einen Artikel darüber schreiben, wie ich eine [Composer-Alternative für das iPad](https://cmpsr.co) erstellt habe, die ich dann mit DraftCode nutze.

Ein weiterer Texteditor, den ich hatte, war [Code Editor](https://panic.com/code-editor/). Dieser war allgemeiner gehalten und konnte mit JavaScript-Dateien auf dem iPad ganz gut umgehen. Man konnte sich auch mit Remote-Servern verbinden und die Dateien direkt im Code Editor aktualisieren.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598511305962_91BE2DCB-7148-4E0B-9FB4-66ACAD600C8C.png)

Das Problem mit Code Editor war allerdings das Kompilieren von JavaScript-Assets. Leider hätte ich bei dessen Nutzung keine Möglichkeit gehabt, Änderungen in der Vorschau zu sehen – besonders auf der JavaScript-Seite.

Schließlich fand ich [Play.js](https://playdotjs.com/). Das ist eine iPad-Applikation, die genau für meinen Anwendungsfall gebaut wurde. Sie hat einen integrierten Editor, Git-Unterstützung, das Ausführen von npm-Skripten und mehr. Mit dieser Power konnte ich eine vollständige NextJS-Anwendung auf meinem iPad ausführen.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598512906014_96CE9F05-CEC1-4B08-BD63-A9E275DDBC5C.gif)

Wir haben einen Gewinner gefunden.

## Hosting und Deployment

Nun, technisch gesehen war das die einfachste Entscheidung. Ich weiß bereits, wie toll es ist, [Netlify](https://netlify.com) zu nutzen. Ich musste nur die `netlify.toml`-Datei hinzufügen und ein paar Änderungen vornehmen – und schon war alles bereit für das Deployment.

Obwohl Play.js seinen eigenen Git-Client mitbringt, bevorzugte ich tatsächlich [Working Copy](https://workingcopyapp.com), einen dedizierten Git-Client für das iPad.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598513367606_022839DC-4930-436D-A3DC-0C5EF330F9E0.png)

Die Commit-Messages bitte ignorieren :P

Nachdem ich Netlify und Git eingerichtet hatte, konnte ich entwickeln und committen, und bei jedem Push erfolgt ein Netlify-Build, der automatisch deployed wird.

![](https://paper-attachments.dropbox.com/s_0D429FF75C9F8F37DBFEA461FA2D1385C9FA98E0828E67A55AFEB8DE50A81014_1598514003196_F50C488A-1A89-4F17-8E66-5162E7F2C955.jpeg)

## Fazit

Es war ein tolles Experiment, eine vollständig funktionierende Anwendung direkt vom iPad aus zu erstellen. Momentan habe ich, wie bereits erwähnt, meinen Raspberry Pi per USB-C mit dem iPad verbunden. Das erlaubt mir, den Pi als Ethernet-Anbieter zu nutzen.

Damit kann ich einen lokalen Server auf dem Raspberry Pi betreiben und die lokale URL über die statische URL auf meinem iPad aufrufen. So konnte ich weiterhin an meinem persönlichen Projekt arbeiten, auf dem Laravel läuft – alles auf dem iPad.

Ich kann mich einfach per SSH über Blink in den lokalen Pi-Server einloggen und alle benötigten Befehle ausführen. Für die Dateiverwaltung habe ich den Raspberry Pi auch als SMB-Server eingerichtet. Dann kann ich mich über die native Dateien-App auf dem iPad mit dem Pi verbinden.

Vielleicht schreibe ich demnächst auch darüber.

Der Quellcode ist noch nicht öffentlich, aber ich bin sicher, dass ich ihn irgendwann veröffentlichen werde.
