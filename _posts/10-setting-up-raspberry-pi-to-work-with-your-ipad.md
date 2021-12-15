---
slug: "10-setting-up-raspberry-pi-to-work-with-your-ipad"
title: "Setting up Raspberry Pi to work with your M1 iPad Pro"
seo_title: "Setting up Raspberry Pi to work with your M1 iPad Pro"
image: "https://user-images.githubusercontent.com/807318/130600269-2174e730-5771-4f8f-9509-505df40452af.jpg"
image_width: 1920
image_height: 1280
description: "Setting up the Raspberry Pi to work with the iPad can unlock some productivity on the go if it's something you are interested in."
date: "2021-08-24 12:50:00"
reading_minutes: 10
tags: ipad, raspberry pi, server
---

After buying my M1 iPad Pro, I decided to use it for more of my work. However, there are many limitations that Apple has on the iPadOS that makes it very painful to work on the iPad even though it clearly has as much power (if not more) as existing laptops. So I decided to get a portable local server where I can do some local development on. Enter the Raspberry Pi.

In this article, I would document how I got the iPad connected to the Raspberry Pi and how I use it for my local development. Since I got the Raspberry Pi 4, the article will refer to this particular device, but I think it is also applicable for other Pi versions.

## Setting up the Raspberry Pi

The first thing to do will be to set up the Raspberry Pi by installing an operating system. For me, I decided to go with the Raspberry Pi OS 64bit version that is still in beta, but you can [choose whatever version you want](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit). Just note that this is based on Raspberry Pi OS and other operating systems may require different steps.

First, you need to download the [Raspberry Pi imager](https://www.raspberrypi.org/software/) for your computer. Connect your Pi's SD card to your computer and start the imager software.

![IMG_0043](https://user-images.githubusercontent.com/807318/130601570-3bbeb159-7944-4b39-98da-dc77f403ef09.png)

Choose the OS to load into the SD card and select the SD card as the storage device, then click "Write". After this is done, safely eject the SD card drive from your computer then reinsert it again.

Next, open the Terminal app and run the following commands in there:

```shell
# Creates a new SSH file in the drive
$ touch /Volumes/boot/ssh
```

Next, if you want to be able to connect the Pi to the internet using WiFi, run the following command:

```shell
$ nano /Volumes/boot/wpa_supplicant.conf
```

and in the new text field, paste the following code:

```
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="WIFI_NAME"
    psk="WIFI_PASSWORD"
}
```

> Replace `DE` with your country short code e.g `NG` for `Nigeria`, `WIFI_NAME` and `WIFI_PASSWORD` with the appropriate values and then save the file. Now you can eject the SD card drive and insert it into your Raspberry Pi.

## Connecting the Raspberry Pi to the M1 iPad Pro

Now that we have added the boot drive to the SD card, we can now boot up the Pi. Connect the Raspberry Pi to your iPad Pro using [a supported USB-C cable](https://www.amazon.de/-/en/gp/product/B06Y25Y6WX/ref=ppx_yo_dt_b_asin_title_o06_s00?ie=UTF8&psc=1) as not all USB-C cables will work. Give the Pi about 2 minutes to fully boot up and connect to the WiFi.

Using an SSH client for the iPad, like [Blink](https://apps.apple.com/de/app/blink-shell-mosh-ssh-client/id1156707581?l=en), connect via SSH to the Pi.

```shell
$ ssh pi@raspberrypi.local
```

> The default password is `raspberry` but be sure to change that later. You can use `sudo raspi-config` for this or follow a guide online.

Next, lets update Pi OS

```
$ sudo apt update
$ sudo apt upgrade -y
```

### Activating Ethernet Connection from the Raspberry Pi to the iPad Pro

Right now, the iPad Pro really just serves as a power source to the Pi. If we want to make a local connection from the iPad to the Pi as an Ethernet provider, we need to prepare the Pi for this.

First, let's install DNSMasq on the Pi:

```
$ sudo apt install dnsmasq -y
```

Next, let's add some configurations to the Pi. First let's make sure the files have the correct execution rights:

```
$ sudo chmod ugo+rwx /boot/config.txt
$ sudo chmod ugo+rwx /boot/cmdline.txt
$ sudo chmod ugo+rwx /etc/modules
$ sudo chmod ugo+rwx /etc/dhcpcd.conf
```

Next, open (or create if not existing) the files one after the other and insert the lines below into the files respectively:

```
# In /boot/config.txt add the following to the end of the file
dtoverlay=dwc2

# In /boot/cmdline.txt add the following to the end of the file (make sure there is a space between the existing commands and this)
modules-load=dwc2

# In /etc/modules add the following to the end of the file
libcomposite

# In /etc/dhcpcd.conf add the following to the end of the file
denyinterfaces usb0
```

Next, create the following files and add the following content

```
$ sudo nano /etc/dnsmasq.d/usb
```

then in the file add:

```
interface=usb0
dhcp-range=10.55.0.2,10.55.0.6,255.255.255.248,1h
dhcp-option=3
leasefile-ro
```

Next file we will create will assign a static IP address `10.55.0.1` which you will use to SSH locally to your Pi from the iPad:

```
$ sudo vim /etc/network/interfaces.d/usb0
```

then add into the file:

```
auto usb0
allow-hotplug usb0
iface usb0 inet static
    address 10.55.0.1
    netmask 255.255.255.248
```

Next file,

```
$ sudo vim /root/usb.sh
$ sudo chmod +x /root/usb.sh
```

then add into the file:

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

> Change `John Doe` to your name and `PI4 USB Device` to whatever you want.

Next, add `sh /root/usb.sh` to the `/etc/rc.local` file, right before the `exit 0` line. Now we can reboot the Raspberry Pi:

```
$ sudo reboot
```

After rebooting your Raspberry Pi, it will show up as a ethernet device with an IP `10.55.0.1` and will assign the device you plug it into an IP address via DHCP.

![iPad Ethernet Raspberry Pi](https://user-images.githubusercontent.com/807318/130610188-555c296a-2029-48e7-bd57-5528c5e2d6dc.jpeg)

Connect the Pi back to the iPad and in Blink, run the command:

```
$ ssh pi@10.55.0.1
```

If you are also trying to use HTTP, you can access this IP from Safari with whatever port your Pi's HTTP exposes.

### Optional: Activating VNC

If you are using the Desktop version of the Raspberry Pi OS then you might benefit from using a VNC to connect to the frontend of the Raspberry Pi. To activate VNC, run the following command:

```
$ sudo raspi-config
```

![raspi-config](https://user-images.githubusercontent.com/807318/130606937-8da552f0-5e4d-4f29-8490-4e5ed3e16f10.png)

Navigate to _Interfacing Options > VNC_ and turn it on to enable this feature. Another thing you can update is your _Localisation Options_.

Hopefully, you are able to set up your Pi and use it for some local development after this.
