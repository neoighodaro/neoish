---
slug: "15-upgrading-the-ssd-on-a-steam-machine"
title: "Die SSD einer Steam Machine aufrüsten"
seo_title: "Die SSD einer Steam Machine aufrüsten (und in Minuten klonen)"
description: "Die 512-GB-Steam-Machine ist schnell voll. So habe ich das Original auf eine 2-TB-SSD geklont und Spiele und Einstellungen behalten, statt SteamOS neu zu installieren."
date: "2026-07-25 10:00:00"
reading_minutes: 6
image: "https://cdn.yulo.app/blog/25-07-2026/steam-machine-ssd-upgrade.avif"
image_alt: "Aufrüsten der SSD einer Valve Steam Machine"
image_caption: "Aufrüsten der SSD einer Valve Steam Machine"
tags: steam machine, steamos, ssd, dd, linux, gaming
featured: true
---

Die Steam Machine gibt es in zwei Größen: ein 512-GB-Basismodell und eine teurere 2-TB-Variante. Bei mir wurde es die Basis, und wer mehr als eine Handvoll moderner Spiele besitzt, weiß, wie das läuft: ein paar große Installationen, und man löscht schon Spiele, um Platz für andere zu machen.

Aktuell verkauft Valve die Steam Machine nicht regulär. Wegen der Nachfrage und der RAM-Knappheit läuft der Verkauf über eine Verlosung: Wirst du gezogen, bekommst du womöglich nicht die Version, die du wolltest. So kannst du bei der 512-GB-Variante landen, obwohl du gern die 2-TB gekauft hättest. Genau so ging es mir, also habe ich die SSD selbst aufgerüstet. Eine nackte 2-TB-NVMe-SSD ist günstig.

Es gibt zwei sinnvolle Wege, SteamOS auf das neue Laufwerk zu bekommen. Der eine ist, das SteamOS-Recovery-Image auf einen USB-Stick zu schreiben, das neue Laufwerk einzubauen und davon neu zu installieren. Das funktioniert einwandfrei. Ich habe den anderen Weg genommen und das vorhandene Laufwerk geklont, vor allem, weil ich so gar keinen bootfähigen USB-Stick brauche und alles genau so übernommen wird, wie es war: Spiele, Einstellungen und Logins. Der Haken: Ein direkter Clone braucht beide Laufwerke gleichzeitig am Rechner, du tauschst den USB-Stick also gegen ein zweites NVMe-Gehäuse. Mit einem kleinen Trick dauert dieser Clone rund 90 Sekunden statt einer Stunde.

## Was du brauchst

- Die [2-TB-NVMe-SSD](https://link.amazon/B09fgxZUc), auf die du umsteigst.
- Zwei USB-NVMe-Gehäuse, eines pro Laufwerk, damit beide gleichzeitig angeschlossen sind. Ich habe [dieses Gehäuse](https://link.amazon/B0ckvVFle) und ein kleineres [portables](https://link.amazon/B0hKez6yN) benutzt, das sich danach nützlich macht (mehr dazu am Ende).
- Einen Rechner mit `dd`. Ich habe einen Mac benutzt, aber jede Linux-Kiste funktioniert genauso (nur die Gerätepfade sehen anders aus).
- Einen Kreuzschlitzschraubendreher für die Steam Machine selbst.

*Hinweis: Der SSD- und der Gehäuse-Link oben sind Affiliate-Links (Werbung). Als Amazon-Partner verdiene ich an qualifizierten Käufen, für dich ohne Mehrkosten.*

Der Plan: das werkseitige 512-GB-Laufwerk ausbauen, es im Gehäuse auf die 2-TB-SSD klonen und diese dann in die Machine einbauen. Auf das Original wird dabei nie geschrieben, es bleibt also ein makelloses Werks-Backup, das du jederzeit wieder einsetzen kannst, falls etwas schiefgeht.

## Die Erkenntnis: eine frische SteamOS-Installation ist fast leer

Genau das macht das Ganze schnell. Ein Clone-Tool kopiert vom Anfang bis zum Ende des Laufwerks, und eine 512-GB-Platte hat 512 GB an *Sektoren*, egal ob etwas darauf steht oder nicht. Eine frische SteamOS-3-Installation (im Kern Arch) belegt aber nur etwa 13 GB. Die restlichen ~500 GB sind leerer Platz, für dessen Kopieren du eine Stunde damit verbringen würdest, Nichts zu übertragen.

Mit `dd` kannst du früh aufhören. Wenn du nur den vorderen Teil des Laufwerks kopierst, genug, um die Partitionen mit echten Daten abzudecken, bekommst du einen bootfähigen, vollständigen Clone in der Zeit, die ~20 GB brauchen. Die GPT und jede echte Partition liegen vorne auf dem Laufwerk; hinter dem Schnittpunkt liegt nur Leere (und der GPT-Backup-Header ganz am Ende, den wir später ohnehin neu erzeugen).

## Das werkseitige Laufwerk ausbauen

Bevor du es klonen kannst, muss die werkseitige SSD aus der Machine raus. Ich dokumentiere nicht neu, was jemand schon gut gefilmt hat: ETA PRIMEs Teardown zeigt, wie man das Gehäuse öffnet und zum Laufwerk kommt. **Folge dem bis zu dem Punkt, an dem die SSD draußen ist, und hör dort auf.** (Das Video geht danach zu einem RAM-Upgrade über; das brauchst du alles nicht.)

<iframe width="100%" height="400" src="https://www.youtube.com/embed/e94U4z5nfJw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Steck die werkseitige 512er in das eine Gehäuse und die leere 2-TB-SSD in das andere, bereit zum Anstecken.

## Das Laufwerk mit `dd` klonen

Schließ die Laufwerke nacheinander an, damit du sie mit Sicherheit auseinanderhältst. Steck zuerst die werkseitige 512er an und lass dir die Platten auflisten:

```shell
$ diskutil list
```

Merk dir die `diskXX`, unter der sie auftaucht, das ist deine **Quelle**. Steck jetzt zusätzlich die 2-TB-SSD an, führ `diskutil list` erneut aus, und der neu hinzugekommene Eintrag ist dein **Ziel**. Bei mir kamen sie als `disk26` und `disk27` hoch. **Mach das richtig.** `dd` schreibt auf das, was hinter `of=` steht, und wenn du auf die falsche Platte zeigst, überschreibt es sie bereitwillig. Deine Nummern werden nicht meine sein.

Hänge die Quelle aus, damit macOS sie nicht offen hält:

```shell
# disk26 ist bei mir die Quelle. Nimm deine eigene Nummer aus diskutil list.
$ diskutil unmountDisk /dev/disk26
```

Dann starte den Clone:

```shell
# Ersetze rdisk26 (Quelle) und rdisk27 (Ziel) durch DEINE eigenen Gerätenummern
# aus diskutil list. Übernimm diese Zeile nicht ungeprüft.
$ sudo dd if=/dev/rdisk26 of=/dev/rdisk27 bs=128m count=150 status=progress
```

Hier passiert einiges:

- **`rdisk` statt `disk`:** auf macOS ist das das *rohe* Gerät, das am Buffer-Cache vorbeigeht und für so eine Massenkopie deutlich schneller ist.
- **`bs=128m`:** in 128-MiB-Blöcken kopieren, damit `dd` nicht Millionen winziger Syscalls macht.
- **`count=150`:** das ist der Trick. 150 Blöcke × 128 MiB ≈ **20 GB**. Das deckt die ~13 GB echter Daten bequem mit Puffer ab und hört dann auf, statt sich durch 500 GB Nichts zu quälen.

Bei meinem Durchlauf war das nach etwa 90 Sekunden fertig:

```shell
# 20132659200 bytes (20 GB, 19 GiB) transferred 90.511s, 222 MB/s
# 150+0 records in
# 150+0 records out
```

### Was du zu `count=` wissen solltest

Den Kopiervorgang früh zu stoppen ist eine Abkürzung, also sei dir im Klaren, worauf sie sich verlässt. Ohne `count=` kopiert `dd` jedes Byte und kann nichts verpassen, egal wie die Partitionen liegen. Mit `count=150` wettest du darauf, dass hinter dem Schnittpunkt nichts Wichtiges liegt. Bei einem werkseitigen SteamOS-Laufwerk ist die Wette sicher, aber es bleibt eine Wette.

Ich gehe sie ein, weil `dd` nur vom alten Laufwerk liest und ich dieses Laufwerk danach unangetastet behalte. Würde der kurze Clone mal nicht booten, ließe ich ihn einfach ohne `count=` erneut laufen und wäre um 90 Sekunden ärmer. So oder so kein Grund zur Sorge: Lass `count=` weg und geh Kaffee kochen, wenn dir das lieber ist.

## Das neue Laufwerk einbauen

Wenn der Clone fertig ist, wirf beide Laufwerke sauber aus:

```shell
$ diskutil eject /dev/disk26
$ diskutil eject /dev/disk27
```

Falls macOS für das frisch geklonte Laufwerk den Dialog *„Die eingelegte CD/DVD war nicht lesbar"* zeigt, klick auf **Ignorieren**, und **nicht** auf Initialisieren. Es ist ein SteamOS-/Linux-Dateisystem; macOS erkennt es nur nicht, und das ist genau richtig.

Jetzt den Teardown rückwärts: Setz die 2-TB-SSD in den M.2-Slot, in dem vorher das Werkslaufwerk saß, und schraub das Gehäuse wieder zu. Verwahre die werkseitige 512er sicher; sie ist jetzt dein Werks-Image.

## Der erste Start

Starte die Machine und durchlaufe das Setup wie gewohnt. Der erste Start kann etwas länger dauern als sonst; das ist normal.

Geh dann auf **Einstellungen → Speicher**. Wenn dort rund 2 TB stehen, hat SteamOS das Dateisystem von selbst auf das neue Laufwerk vergrößert und **du bist fertig**. Installier Spiele.

## Wenn weiter 512 GB angezeigt werden: die Partition vergrößern

Zeigt der Speicher weiterhin ~512 GB an, muss der Partitionstabelle nur mitgeteilt werden, dass die Platte größer geworden ist. Wechsle in den Desktop-Modus, öffne Konsole und schieb den GPT-Backup-Header ans echte Ende des Laufwerks:

```shell
$ sudo sgdisk -e /dev/nvme0n1
```

Vergrößere dann die letzte Partition, die große `/home`-Partition, auf der deine Spiele liegen, so, dass sie den freien Platz füllt. Am schmerzlosesten geht das per GUI: öffne den **KDE Partition Manager** (bei Bedarf aus Discover installieren), Rechtsklick auf die letzte Partition, **Größe ändern/verschieben**, bis zum Plattenende aufziehen und anwenden. Neu starten, und Einstellungen → Speicher sollte jetzt die vollen 2 TB zeigen.

## Bonus: Spiele über das LAN holen statt neu herunterladen

Wenn du diese Spiele schon auf einem Steam Deck installiert hast, musst du sie nicht alle erneut aus dem Netz ziehen. Ist das Deck eingeschaltet und im selben Netzwerk, starte auf der Machine die Installation eines Spiels, und Steam erkennt die lokale Kopie und bietet an, sie stattdessen über dein LAN zu übertragen. Schneller ist das nicht immer (über WLAN kann ein flotter kabelgebundener Download sie sogar schlagen), aber es spart das erneute Herunterladen, und man vergisst leicht, dass es das überhaupt gibt.

## Bonus: die alte 512er weiterverwenden

Das ausgebaute Laufwerk muss nicht in der Schublade landen. Steck es in ein kleines USB-Gehäuse, und du hast eine handliche externe SSD, die du zwischen Steam Machine und Steam Deck hin- und hertragen kannst, mit derselben Bibliothek auf beiden. Das [Gehäuse, das ich benutzt habe](https://link.amazon/B0hKez6yN), ist klein genug für die Tasche. Kommt noch eine microSD-Karte dazu, bist du in Summe locker jenseits von 4 TB Speicher.

Der einzige Haken: Sobald du sie für Speicher formatierst, ist sie nicht mehr dein Werks-Backup. Wenn dir dieses Sicherheitsnetz wichtig ist, nimm ein separates Laufwerk für den portablen Speicher und lass das Original unberührt.

## Das war's

Neues Laufwerk, viermal so viel Platz, und jedes Spiel, jede Einstellung und jeder Login übernommen, ohne eine einzige Neuinstallation. Und weil die originale 512er nie angefasst wurde, hat die ganze Aktion einen Rückgängig-Knopf, der auf deinem Schreibtisch liegt. Sieht je etwas falsch aus, kommt das Werkslaufwerk zurück und du bist genau da, wo du angefangen hast.
