# Using Studyroom on a tablet

Studyroom runs on a computer. This guide connects your tablet to it, so you can read handouts,
watch lectures, write pen notes and use the study chat from the couch instead of the desk.

You will need about fifteen minutes, and both devices to hand.

**How it works, in one sentence:** Tailscale creates a small private network containing only your
own devices, and the tablet reaches Studyroom across it. Nothing is published to the internet, and
nobody else can open your materials.

**One thing to know before you start:** the computer running Studyroom has to stay awake and
running while you use the tablet. The tablet is a window onto the computer, not a copy of it. If
the computer sleeps, the tablet stops working until you wake it.

---

## Step 1 — Put Tailscale on the computer

Go to **<https://tailscale.com/download>** and install it for your computer.

Open it and sign in. Any of the sign-in options work — Google, Microsoft, GitHub — but **remember
which one you choose**, because the tablet has to use the same one.

When it finishes, Tailscale says **Connected**. On a Mac it lives in the menu bar at the top of the
screen; on Windows, in the system tray near the clock.

> **Mac note:** you may be asked to allow a VPN configuration. That is expected — Tailscale is a
> private network, so macOS asks the same question it would for any VPN.

---

## Step 2 — Put Tailscale on the tablet

Install **Tailscale** from the **App Store** (iPad) or **Google Play** (Android).

Open it and **sign in the same way you did on the computer.** This is the step that matters most —
if the two devices sign in differently, they end up on separate networks and cannot see each other.

Turn the switch on. It should say **Connected**.

---

## Step 3 — Find the computer's address

On the private network, your computer gets its own address. It looks like `100.87.42.19` — four
numbers, always starting with `100`.

**The easiest way:** click the Tailscale icon (Mac menu bar, Windows system tray). Your computer is
at the top of the list, with its address beside it. Click it to copy.

**If you would rather see it in a browser:** go to **<https://login.tailscale.com/admin/machines>**
and sign in. Every device is listed with its address.

Write the address down. You need it twice.

> Your address is yours and it does not change on its own, so this is a once-only step. It is not a
> secret, but it is also not useful to anyone else — only your own signed-in devices can reach it.

---

## Step 4 — Start Studyroom on that address

On the computer, open **Terminal** (Mac) or **Command Prompt** (Windows). Type the following, with
your own address in place of the example, and press Enter.

**Mac:**

```sh
cd ~/Studyroom
STUDYROOM_HOST=100.87.42.19 ./start
```

**Windows:**

```
cd %USERPROFILE%\Studyroom
set STUDYROOM_HOST=100.87.42.19
.\studyroom.cmd
```

You should see a line like:

```
Studyroom → http://100.87.42.19:4321
```

**That line is the confirmation.** If instead you see a message beginning "Cannot bind", read
[Step 6](#step-6--if-something-does-not-work) — it tells you exactly what went wrong.

Leave this window open. Closing it, or pressing Ctrl-C, stops Studyroom.

---

## Step 5 — Open it on the tablet

In the tablet's browser, type the address and `:4321` after it:

```
http://100.87.42.19:4321
```

Studyroom opens. Everything works exactly as it does on the computer — your subjects, the PDFs, the
lecture videos, the study chat, and pen notes if you have a stylus.

**Add it to your home screen** so you do not have to type the address again:

- **iPad (Safari):** the share button → **Add to Home Screen**
- **Android (Chrome):** the ⋮ menu → **Add to Home screen**

---

## Step 6 — If something does not work

**"Cannot bind … this machine has no such address right now"**
Tailscale is not connected on the computer, or the address is wrong. Open Tailscale, check it says
Connected, and check the address again in Step 3.

**"Port 4321 is already in use"**
Studyroom is already running in another window. Close that window first, or just use the copy that
is already running.

**The tablet says it cannot connect, or the page never loads**
Work through these in order:

1. Is Tailscale switched on and showing **Connected** on the tablet?
2. Is it on the computer too?
3. Are both signed in the same way? Open <https://login.tailscale.com/admin/machines> — **both
   devices must appear in that one list.** If only one does, sign the other out and back in using
   the same option.
4. Is the Terminal window still open on the computer, showing the `Studyroom →` line?
5. Is the computer awake?

**It worked yesterday and today it does not**
Almost always the computer is asleep, or Studyroom was closed. Wake it and run the Step 4 command
again.

**Everything is fine but the address stopped working**
Rare, but addresses can change if a device is removed and re-added. Check Step 3 again.

---

## Letting someone else use it

Another person can reach your Studyroom without joining your network or seeing anything else on it.
You share one machine with them, and only that machine.

### Read this before you share

**Sharing gives someone the same powers you have. There is no read-only mode, and no way to hide
the edit buttons from them.** Anyone you share with can:

- upload files, edit your notes, rename them, and move them to the archive;
- **use the study chat — which runs programs on your computer, and is paid for out of your
  account.** They can use as much of it as they like, and it can change files in your subjects.

That second one is why the usual advice applies: **share only with someone you would hand your
unlocked laptop to.** Not "someone you trust with your notes" — someone you trust with the
computer.

If that is not the person, don't share. Send them the file you wanted them to see instead.

### How to share

1. They install Tailscale and make their own account — Step 1, on their own computer or tablet.
2. You go to **<https://login.tailscale.com/admin/machines>**.
3. Find the computer running Studyroom, open the **⋯** menu beside it, and choose **Share**.
4. Send them the link Tailscale gives you. They open it and accept.
5. They can now open `http://100.87.42.19:4321` on their own device.

They get access to **that one machine and nothing else** — not your other devices, not your files
beyond what Studyroom itself shows.

**You can undo it at any time** from the same **⋯** menu — find the share and revoke it. Access
stops immediately.

---

## What this does not do

- **It does not run without the computer.** No computer, no Studyroom. Nothing is stored on the
  tablet, so if you want to read on a plane, save the PDFs to the tablet separately beforehand.
- **It does not make Studyroom public.** That is the point. Only devices signed into your network,
  and anyone you have explicitly shared with, can reach it at all.
- **It does not need your Wi-Fi.** The tablet can be on mobile data, on campus Wi-Fi, anywhere.
  Tailscale connects the two devices wherever they are.

---

## The short version, once you have set it up

1. Computer: make sure Tailscale says Connected.
2. Computer: `cd ~/Studyroom` then `STUDYROOM_HOST=<your address> ./start`
3. Tablet: open the home-screen icon.
