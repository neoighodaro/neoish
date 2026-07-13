---
slug: "7-automatically-appending-jira-issue-to-commit-message"
title: "Jira-Issues automatisch an Commit-Messages anhängen"
seo_title: "Jira-Issues automatisch an Git-Commit-Messages anhängen"
image: "https://neoish.s3-eu-west-1.amazonaws.com/images/jira-issue.png"
image_width: 1922
image_height: 734
description: "Die Git-Integration von Jira kann Commits und Branches automatisch einem Ticket zuordnen — aber nur, wenn du das hier zuerst einrichtest."
date: "2021-04-24 17:02:00"
reading_minutes: 1
tags: git, automation, bash
---

Wenn du Jira verwendest, kennst du wahrscheinlich bereits die Git-Integration für Issues. Damit kann ein Ticket die zugehörigen Git-Commits und Branches automatisch abrufen. Damit das funktioniert, muss der Branch-Name, der Pull Request oder der Commit den Issue-Code enthalten, z. B. `DEV-1234`.

Bei Branches ist das unkompliziert: Du erstellst den Branch einmalig mit dem Issue-Namen, und Jira erkennt ihn automatisch. Bei Pull Requests verhält es sich genauso.

Bei Commits hingegen werden diese nicht dem Issue zugeordnet, wenn du die Issue-Nummer nicht manuell in jede Commit-Message einträgst — und das möchten wir natürlich vermeiden.

## Jira-Issue-Nummern automatisch an Commits anhängen

Damit unsere Commits die Issue-Nummer automatisch erhalten, nutzen wir [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) — konkret den `prepare-commit-msg`-Hook. Falls du Git hooks noch nicht kennst, lohnt sich ein Blick in die Dokumentation. Kurz gesagt erlauben sie dir, in den Lebenszyklus deiner Git-verwalteten Anwendung einzugreifen.

Ich richte das persönlich lieber global ein, aber fangen wir zunächst auf Projektebene an und besprechen danach die globale Variante. Das Prinzip ist dasselbe.

### Einrichtung pro Projekt

Wechsle zunächst mit `cd` in dein Projektverzeichnis und erstelle dort eine neue Datei namens `prepare-commit-msg` im Verzeichnis `.git/hooks` deines Projekts. Mach sie anschließend ausführbar:

```shell
$ touch .git/hooks/prepare-commit-msg
$ chmod +x .git/hooks/prepare-commit-msg
```

Füge danach folgenden Inhalt in die Datei ein:

```bash
#!/bin/bash
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [[ "${BRANCH_NAME}" =~ [A-Z]{2,}-[[:digit:]]+ ]]; then
  ISSUE_IDENTIFIER="${BASH_REMATCH[0]}"
fi

if [[ -n $ISSUE_IDENTIFIER ]]; then
  sed -i.bak -e "1s/^/$ISSUE_IDENTIFIER /" $1
fi
```

Das Skript sucht per regulärem Ausdruck nach einem Issue-Identifier im Branch-Namen und hängt diesen bei Treffer automatisch an die Commit-Message an.

> Möglicherweise musst du den RegEx an dein Projekt anpassen. Dieser geht vom Format XX-1234 aus: zwei oder mehr Großbuchstaben, gefolgt von einem Bindestrich und Zahlen — das ist üblicherweise das Standardformat in Jira.

So einfach ist das. Ab jetzt enthält jeder deiner Commits automatisch die Issue-Nummer, sofern diese bereits im Branch-Namen vorhanden ist.

Du könntest das Ganze noch verfeinern, indem du bestimmte Branches von dieser Prüfung ausschließt — für meine Zwecke reicht diese Lösung aber vollkommen aus.

### Einrichtung für alle Projekte

Um den Hook global zu aktivieren, musst du deine `.gitconfig`-Datei anpassen. Nutze dafür die Einstellung [core.hooksPath](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath).

Ein Beispiel dafür findest du in meinem .dotfiles-Repo. Schau dir [Zeile 15](https://github.com/neoighodaro/dotfiles/blob/master/.gitconfig#L15) für die Git-Konfiguration an. Du musst lediglich ein Verzeichnis für deine globalen Hooks anlegen und in der Konfiguration darauf verweisen.

> Hinweis: Dafür benötigst du Git v2.9 oder höher. Außerdem werden globale Hooks in GitKraken zum Zeitpunkt dieses Artikels (Version `v7.5.2`) nicht unterstützt. Verwende in dem Fall die projektbezogene Konfiguration oder verlinke den Hook per Symlink auf deinen globalen Hook.
