# Build & Run

## What you need

- Node.js 18+ and npm
- An Expo account (free) — [expo.dev/signup](https://expo.dev/signup)
- For a real `.apk`: `eas-cli` (installed below) — no Android Studio required, EAS builds in the cloud
- To test on your phone while coding: the **Expo Go** app from the Play Store, or an Android emulator

## 1. Install dependencies

```bash
cd hackers-ride
npm install
```

## 2. Run it locally (fastest way to try it)

```bash
npx expo start
```

This prints a QR code. Scan it with **Expo Go** on an Android phone (or press `a` to open an Android emulator if you have one). The app hot-reloads as you edit files. This mode is enough to walk through the full ride journey — SQLite, Zustand, and the simulated map all behave exactly the same as in a built APK.

If you hit a stale-cache issue after changing native config (`app.json`):

```bash
npm run reset-cache
```

## 3. Build a real, installable Android APK

The app is set up for **EAS Build** — Expo's cloud build service. You don't need Android Studio or a local Android SDK.

```bash
npm install -g eas-cli
eas login                     # sign in with your Expo account
eas build:configure           # first time only — links this project to EAS
npm run build:apk             # runs: eas build -p android --profile preview
```

EAS uploads the project, builds it in the cloud, and gives you a **download link for a real `.apk`** when it finishes (usually 10–20 minutes). Download it, open the link on any Android phone, and install it — you'll need to allow "install from unknown sources" the first time, which is normal for any app not distributed through the Play Store.

## 4. Quick sanity check before building

```bash
npx tsc --noEmit     # type-check the whole project
```

## Demo credentials

- **OTP code:** `123456` — shown as a helper on the OTP screen, no real SMS is sent
- **Demo card:** `•••• 4821` — pre-seeded, no real card entry required
- **Referral code:** `HACKRIDE`

## Common issues

| Symptom | Fix |
|---|---|
| Blank white screen on first launch | Usually a stale Metro cache — run `npm run reset-cache` |
| `expo-sqlite` errors in Expo Go | Make sure you're on SDK 51's Expo Go build (SDKs must match); if in doubt, build the APK with EAS instead |
| Map area looks empty | The map is a bundled SVG simulation, not live tile data — no API key or network needed. If it's blank, check that `react-native-svg` installed correctly |
