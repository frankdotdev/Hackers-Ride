# Getting Hacker's Ride in front of other people

There are three realistic ways to let someone else try this, in order of how fast you can get it done:

## Option A — Share an Expo link (fastest, good for quick demos)

1. `npx expo start`
2. Instead of scanning the QR code yourself, send it (or the `exp://...` link) to anyone who has the **Expo Go** app on Android.
3. They open Expo Go, scan or paste the link, and the app runs on their phone — pulling from your locally-running bundler over the network.

One catch: your computer needs to stay running and reachable (same Wi-Fi, or use `npx expo start --tunnel` to get past network boundaries). This works great for a live walkthrough, but it's not a permanent link.

## Option B — A real downloadable APK via EAS Build (best for a portfolio link)

This is what I'd recommend for something you want to drop in a resume, portfolio site, or WhatsApp message and have someone install permanently.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

EAS builds the app in the cloud and gives you a URL like `https://expo.dev/artifacts/eas/xxxxx.apk`. That link:

- Can be opened directly on an Android phone's browser to download and install the APK
- Can be shared as-is — no Play Store listing needed
- Stays live on Expo's servers (check your EAS dashboard for exact retention)

**To install:** the recipient opens the link on their Android phone, downloads the `.apk`, and taps it. Android will ask to allow installs from that source the first time — totally expected for any app distributed outside the Play Store.

## Option C — Play Store internal testing track (most polished feeling)

If you want a Play Store install link instead of a raw APK:

1. Build an `.aab` instead: `eas build -p android --profile production`
2. Create a free Google Play Console account (one-time \$25 fee from Google, not Expo)
3. Upload the `.aab` to an **Internal Testing** track
4. Share the opt-in link — testers install it through the Play Store like any other app, no "unknown sources" warning

This is the most polished option for a portfolio piece, but it adds real setup overhead (Play Console account, store listing basics, privacy policy URL). I'd only bother with this if you specifically want the "published app" impression.

## My recommendation

For a portfolio/demo, **Option B (EAS `preview` APK)** is the sweet spot — a real installable app, a permanent shareable link, no Play Store account needed, done in one command.
