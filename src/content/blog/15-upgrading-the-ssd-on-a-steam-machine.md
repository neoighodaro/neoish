---
title: Upgrading the SSD on a Steam Machine
seo_title: 'How to Upgrade the SSD on a Steam Machine (and clone it in minutes)'
description: The 512GB Steam Machine fills up fast. Here's how I cloned the original onto a 2TB drive, keeping my games and settings, instead of reinstalling SteamOS from scratch.
date: 2026-07-25 10:00:00
tags: steam machine, steamos, ssd, dd, linux, gaming
reading_minutes: 6
image: https://cdn.yulo.app/blog/25-07-2026/steam-machine-ssd-upgrade.avif
image_alt: upgrading the ssd on a valve steam machine
image_caption: upgrading the ssd on a valve steam machine
slug: 15-upgrading-the-ssd-on-a-steam-machine
featured: true
---

The Steam Machine comes in two sizes: a 512GB base model and a pricier 2TB one. I ended up with the base, and if you own more than a handful of modern games, you know how that goes: a couple of big installs and you're already deleting games to make room for others.

Right now Valve isn't selling the Steam Machine off the shelf. Because of demand and the RAM shortage, it's a raffle: get drawn and you might not get the version you wanted, so you can land on the 512GB even if you'd have happily bought the 2TB. That's what happened to me, so I upgraded the SSD myself. A bare 2TB NVMe drive is cheap.

There are two sensible ways to get SteamOS onto the new drive. One is to write the SteamOS recovery image to a USB stick, install the new drive, and reinstall from it. That works perfectly well. I went the other way and cloned the existing drive instead, mainly because it means I don't need a bootable USB at all, and everything carries over exactly as it was: games, settings, and logins. The trade is that a direct clone needs both drives connected at once, so you want two NVMe enclosures instead of one USB stick. With one small trick, that clone takes about ninety seconds instead of an hour.

## What you'll need

- The [2TB NVMe SSD](https://link.amazon/B09fgxZUc) you're upgrading to.
- Two USB NVMe enclosures, one for each drive, so both can be connected at once. I used [this enclosure](https://link.amazon/B0ckvVFle) and a smaller [portable one](https://link.amazon/B0hKez6yN) that comes in handy afterwards (more on that at the end).
- A machine with `dd`. I used a Mac, but any Linux box works the same way (the device paths just look different).
- A Phillips screwdriver for the Steam Machine itself.

*Disclosure: the SSD and enclosure links above are affiliate links. As an Amazon Associate I earn from qualifying purchases, at no extra cost to you.*

The plan: pull the factory 512GB drive, clone it onto the 2TB in an enclosure, then install the 2TB in the Machine. The original never gets written to, so it stays a pristine factory backup you can drop back in if anything goes sideways.

## The insight: a factory SteamOS install is almost empty

Here's the part that makes this fast. A clone tool copies from the start of the disk to the end, and a 512GB drive is 512GB of *sectors* whether or not there's anything on them. But a fresh SteamOS 3 install (Arch under the hood) only occupies around 13GB. The remaining ~500GB is empty space you'd be spending an hour copying nothing across.

`dd` lets you stop early. If you only copy the first chunk of the disk, enough to cover the partitions that actually contain data, you get a bootable, complete clone in the time it takes to copy ~20GB. The GPT and every real partition live at the front of the drive; the only thing past the cutoff is emptiness (and the backup GPT header at the very end, which we regenerate later anyway).

## Take the factory drive out

Before you can clone it, the factory SSD has to come out of the Machine. I'm not going to re-document what someone has already filmed well: ETA PRIME's teardown walks through opening the case and getting to the drive. **Follow it up to the point where the SSD is out, and stop there.** (The video goes on to a RAM upgrade; you don't need any of that.)

<iframe width="100%" height="400" src="https://www.youtube.com/embed/e94U4z5nfJw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Put the factory 512GB into one enclosure and the blank 2TB into the other, ready to plug in.

## Cloning the drive with `dd`

Connect the drives one at a time so you can tell them apart with certainty. Plug in the factory 512GB first and list the disks:

```shell
$ diskutil list
```

Note the `diskXX` it shows up as, that's your **source**. Now plug in the 2TB as well, run `diskutil list` again, and the entry that just appeared is your **target**. In my case they came up as `disk26` and `disk27`. **Get this right.** `dd` writes to whatever you put after `of=`, and if you point it at the wrong disk it will happily overwrite it. Your numbers will not be mine.

Unmount the source so macOS isn't holding it open:

```shell
# disk26 is my source drive. Use your own number from diskutil list.
$ diskutil unmountDisk /dev/disk26
```

Then run the clone:

```shell
# Replace rdisk26 (source) and rdisk27 (target) with YOUR own device numbers
# from diskutil list. Do not copy this line verbatim.
$ sudo dd if=/dev/rdisk26 of=/dev/rdisk27 bs=128m count=150 status=progress
```

A few things are doing work here:

- **`rdisk` instead of `disk`:** on macOS that's the *raw* device, which skips the buffer cache and is dramatically faster for a bulk copy like this.
- **`bs=128m`:** copy in 128 MiB blocks so `dd` isn't making millions of tiny syscalls.
- **`count=150`:** this is the trick. 150 blocks × 128 MiB ≈ **20GB**. That comfortably covers the ~13GB of real data with a healthy margin, and stops there instead of grinding through 500GB of nothing.

On my run that finished in about 90 seconds:

```shell
# 20132659200 bytes (20 GB, 19 GiB) transferred 90.511s, 222 MB/s
# 150+0 records in
# 150+0 records out
```

### One thing to know about `count=`

Stopping the copy early is a shortcut, so be aware of what it assumes. Drop `count=` and `dd` copies every byte, which can't miss anything no matter how the partitions sit. Keep `count=150` and you're betting that nothing you care about lives past the cutoff. On a stock SteamOS drive that bet is safe, but it is a bet.

I'm fine taking it because `dd` only reads from the old drive, and I keep that drive as-is afterward. If the short clone ever refused to boot, I'd just run it again without `count=` and be out ninety seconds. Not worth the worry either way: leave `count=` off and go make coffee if you'd rather.

## Put the new drive in

When the clone finishes, eject both drives cleanly:

```shell
$ diskutil eject /dev/disk26
$ diskutil eject /dev/disk27
```

If macOS throws up a *"The disk you inserted was not readable"* dialog for the freshly-cloned drive, click **Ignore**, and do **not** click Initialize. It's a SteamOS/Linux filesystem; macOS just doesn't recognise it, which is exactly right.

Now reverse the teardown: seat the 2TB in the M.2 slot where the factory drive was, and put the case back together. Stash the factory 512GB somewhere safe; it's your factory image now.

## First boot

Boot the Machine and go through setup as normal. First boot can take a touch longer than usual; that's fine.

Once you're in, head to **Settings → Storage**. If it reports roughly 2TB, SteamOS grew the filesystem to fill the new drive on its own and **you're done**. Go install games.

## If it still shows 512GB: expand the partition

If storage still reads ~512GB, the partition table just needs to be told the disk got bigger. Drop into desktop mode, open Konsole, and move the GPT backup header out to the true end of the drive:

```shell
$ sudo sgdisk -e /dev/nvme0n1
```

Then resize the last partition, the big `/home` partition where your games live, to fill the free space. The painless way is a GUI: open **KDE Partition Manager** (install it from Discover if it isn't already there), right-click the last partition, choose **Resize/Move**, drag it out to fill the disk, and apply. Reboot, and Settings → Storage should now show the full 2TB.

## Bonus: move your games over LAN instead of re-downloading

If you already have these games installed on a Steam Deck, you don't need to pull them all down from the internet again. With the Deck powered on and on the same network, start installing a game on the Machine, and Steam detects the local copy and offers to transfer it over your LAN instead. It won't always be faster (over WiFi a quick wired download can actually beat it), but it saves re-downloading everything, and it's the kind of thing that's easy to forget exists.

## Bonus: put the old 512GB back to work

The drive you pulled doesn't have to sit in a drawer. Drop it into a small USB enclosure and it becomes a pocketable external SSD you can carry between the Steam Machine and a Steam Deck, using the same library on either. The [enclosure I used](https://link.amazon/B0hKez6yN) is tiny enough to live in a bag. Add a microSD card on top and you're comfortably past 4TB of total storage across the setup.

The one caveat: the moment you format it for storage, it stops being your factory backup. If keeping that safety net matters to you, use a separate drive for portable storage and leave the original untouched.

## That's it

New drive, four times the space, and every game, setting, and login carried across without a single reinstall. And because the original 512GB never got touched, the whole operation has an undo button sitting on your desk. If anything ever looks wrong, the factory drive goes back in and you're exactly where you started.
