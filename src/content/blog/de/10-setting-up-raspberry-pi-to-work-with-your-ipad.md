---
slug: "10-setting-up-raspberry-pi-to-work-with-your-ipad"
title: "Raspberry Pi mit dem M1 iPad Pro einrichten"
seo_title: "Raspberry Pi mit dem M1 iPad Pro einrichten"
image: "https://user-images.githubusercontent.com/807318/130600269-2174e730-5771-4f8f-9509-505df40452af.jpg"
image_width: 1920
image_height: 1280
description: "Den Raspberry Pi fürs iPad einzurichten kann unterwegs echte Produktivitätsvorteile bringen – wenn dich das interessiert."
date: "2021-08-24 12:50:00"
reading_minutes: 10
tags: ipad, raspberry pi, server
---

Nachdem ich mir das M1 iPad Pro gekauft hatte, wollte ich es für mehr meiner Arbeit nutzen. Allerdings schränkt Apple iPadOS so stark ein, dass das Arbeiten auf dem iPad oft frustrierend ist – obwohl es locker so viel Leistung hat wie ein aktuelles Laptop. Also entschied ich mich, einen tragbaren lokalen Server zu besorgen, auf dem ich lokal entwickeln kann. Willkommen, Raspberry Pi.

In diesem Artikel dokumentiere ich, wie ich das iPad mit dem Raspberry Pi verbunden habe und wie ich ihn für die lokale Entwicklung nutze. Da ich einen Raspberry Pi 4 habe, beziehe ich mich auf dieses Modell – die Schritte sollten aber auch für andere Pi-Versionen funktionieren.

## Den Raspberry Pi einrichten

Als Erstes muss ein Betriebssystem auf den Raspberry Pi installiert werden. Ich habe mich für die noch in der Beta befindliche 64-Bit-Version von Raspberry Pi OS entschieden, aber du kannst [die Version wählen, die du möchtest](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit). Beachte, dass diese Anleitung auf Raspberry Pi OS basiert – andere Betriebssysteme können abweichende Schritte erfordern.

Zunächst musst du den [Raspberry Pi Imager](https://www.raspberrypi.org/software/) für deinen Computer herunterladen. Verbinde die SD-Karte des Pi mit deinem Computer und starte die Imager-Software.

![IMG_0043](https://user-images.githubusercontent.com/807318/130601570-3bbeb159-7944-4b39-98da-dc77f403ef09.png)

Wähle das Betriebssystem, das auf die SD-Karte geschrieben werden soll, und wähle die SD-Karte als Speichermedium aus. Klicke dann auf „Write". Wenn der Vorgang abgeschlossen ist, wirf das SD-Karten-Laufwerk sicher aus und stecke es erneut ein.

Öffne danach die Terminal-App und führe dort die folgenden Befehle aus:

```shell
# Erstellt eine neue SSH-Datei auf dem Laufwerk
$ touch /Volumes/boot/ssh
```

Wenn du den Pi über WLAN mit dem Internet verbinden möchtest, führe folgenden Befehl aus:

```shell
$ nano /Volumes/boot/wpa_supplicant.conf
```

und füge in das neu geöffnete Textfeld folgenden Code ein:

```
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="WIFI_NAME"
    psk="WIFI_PASSWORD"
}
```

> Ersetze `DE` mit deinem Länderkürzel, z. B. `NG` für `Nigeria`, und ersetze `WIFI_NAME` und `WIFI_PASSWORD` durch die entsprechenden Werte. Speichere die Datei anschließend. Jetzt kannst du die SD-Karte auswerfen und in den Raspberry Pi einlegen.

## Den Raspberry Pi mit dem M1 iPad Pro verbinden

Nachdem wir das Boot-Laufwerk auf die SD-Karte geschrieben haben, können wir den Pi starten. Verbinde den Raspberry Pi mit deinem iPad Pro über [ein kompatibles USB-C-Kabel](https://www.amazon.de/-/en/gp/product/B06Y25Y6WX/ref=ppx_yo_dt_b_asin_title_o06_s00?ie=UTF8&psc=1) – nicht alle USB-C-Kabel funktionieren. Gib dem Pi etwa 2 Minuten, um vollständig hochzufahren und sich mit dem WLAN zu verbinden.

Verbinde dich mithilfe eines SSH-Clients für das iPad, z. B. [Blink](https://apps.apple.com/de/app/blink-shell-mosh-ssh-client/id1156707581?l=en), per SSH mit dem Pi:

```shell
$ ssh pi@raspberrypi.local
```

> Das Standardpasswort lautet `raspberry` – ändere es jedoch bald. Du kannst `sudo raspi-config` verwenden oder einer Anleitung im Internet folgen.

Als nächstes aktualisieren wir das Pi OS:

```
$ sudo apt update
$ sudo apt upgrade -y
```

### Ethernet-Verbindung vom Raspberry Pi zum iPad Pro aktivieren

Im Moment dient das iPad Pro eigentlich nur als Stromquelle für den Pi. Wenn wir eine lokale Verbindung vom iPad zum Pi als Ethernet-Anbieter herstellen möchten, müssen wir den Pi entsprechend vorbereiten.

Zunächst installieren wir DNSMasq auf dem Pi:

```
$ sudo apt install dnsmasq -y
```

Als nächstes nehmen wir einige Konfigurationen am Pi vor. Zuerst stellen wir sicher, dass die Dateien die richtigen Ausführungsrechte haben:

```
$ sudo chmod ugo+rwx /boot/config.txt
$ sudo chmod ugo+rwx /boot/cmdline.txt
$ sudo chmod ugo+rwx /etc/modules
$ sudo chmod ugo+rwx /etc/dhcpcd.conf
```

Öffne (oder erstelle, falls noch nicht vorhanden) die folgenden Dateien nacheinander und füge jeweils die angegebenen Zeilen ein:

```
# In /boot/config.txt am Ende der Datei hinzufügen
dtoverlay=dwc2

# In /boot/cmdline.txt am Ende der Datei hinzufügen (achte auf ein Leerzeichen zwischen den bestehenden Befehlen und diesem hier)
modules-load=dwc2

# In /etc/modules am Ende der Datei hinzufügen
libcomposite

# In /etc/dhcpcd.conf am Ende der Datei hinzufügen
denyinterfaces usb0
```

Erstelle nun die folgende Datei und füge den angegebenen Inhalt ein:

```
$ sudo nano /etc/dnsmasq.d/usb
```

und füge in die Datei ein:

```
interface=usb0
dhcp-range=10.55.0.2,10.55.0.6,255.255.255.248,1h
dhcp-option=3
leasefile-ro
```

Die nächste Datei weist die statische IP-Adresse `10.55.0.1` zu, über die du dich vom iPad lokal per SSH mit dem Pi verbinden kannst:

```
$ sudo vim /etc/network/interfaces.d/usb0
```

und füge in die Datei ein:

```
auto usb0
allow-hotplug usb0
iface usb0 inet static
    address 10.55.0.1
    netmask 255.255.255.248
```

Nächste Datei:

```
$ sudo vim /root/usb.sh
$ sudo chmod +x /root/usb.sh
```

und füge in die Datei ein:

```
#!/bin/bash
cd /sys/kernel/config/usb_gadget/
mkdir -p pi4
cd pi4
echo 0x1d6b > idVendor # Linux Foundation
echo 0x0104 > idProduct # Multifunction Composite Gadget
echo 0x0100 > bcdDevice # v1.0.0
echo 0x0200 > bcdUSB # USB2
echo 0xEF > bDeviceClass
echo 0x02 > bDeviceSubClass
echo 0x01 > bDeviceProtocol
mkdir -p strings/0x409
echo "fedcba9876543211" > strings/0x409/serialnumber
echo "John Doe" > strings/0x409/manufacturer
echo "PI4 USB Device" > strings/0x409/product
mkdir -p configs/c.1/strings/0x409
echo "Config 1: ECM network" > configs/c.1/strings/0x409/configuration
echo 250 > configs/c.1/MaxPower
# Add functions here
# see gadget configurations below
# End functions
mkdir -p functions/ecm.usb0
HOST="00:dc:c8:f7:75:14" # "HostPC"
SELF="00:dd:dc:eb:6d:a1" # "BadUSB"
echo $HOST > functions/ecm.usb0/host_addr
echo $SELF > functions/ecm.usb0/dev_addr
ln -s functions/ecm.usb0 configs/c.1/
udevadm settle -t 5 || :
ls /sys/class/udc > UDC
ifup usb0
service dnsmasq restart
```

> Ersetze `John Doe` durch deinen Namen und `PI4 USB Device` durch einen beliebigen Namen.

Füge als nächstes `sh /root/usb.sh` in die Datei `/etc/rc.local` ein, direkt vor der Zeile `exit 0`. Jetzt können wir den Raspberry Pi neu starten:

```
$ sudo reboot
```

Nach dem Neustart erscheint der Raspberry Pi als Ethernet-Gerät mit der IP `10.55.0.1` und weist dem angeschlossenen Gerät per DHCP eine IP-Adresse zu.

![iPad Ethernet Raspberry Pi](https://user-images.githubusercontent.com/807318/130610188-555c296a-2029-48e7-bd57-5528c5e2d6dc.jpeg)

Verbinde den Pi wieder mit dem iPad und führe in Blink folgenden Befehl aus:

```
$ ssh pi@10.55.0.1
```

Wenn du auch HTTP nutzen möchtest, kannst du diese IP-Adresse in Safari aufrufen – mit dem Port, den dein Pi-HTTP-Server bereitstellt.

### Optional: VNC aktivieren

Wenn du die Desktop-Version von Raspberry Pi OS verwendest, kann es sinnvoll sein, VNC zu nutzen, um auf die grafische Oberfläche des Raspberry Pi zuzugreifen. Zum Aktivieren von VNC führe folgenden Befehl aus:

```
$ sudo raspi-config
```

![raspi-config](https://user-images.githubusercontent.com/807318/130606937-8da552f0-5e4d-4f29-8490-4e5ed3e16f10.png)

Navigiere zu _Interfacing Options > VNC_ und aktiviere die Option. Du kannst dort auch deine _Localisation Options_ anpassen.

Ich hoffe, du schaffst es, deinen Pi einzurichten und ihn für die lokale Entwicklung zu nutzen.
