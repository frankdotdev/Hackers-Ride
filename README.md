# Hacker's Ride

*Your ride. Your route. Your way.*

I built this as a portfolio project — a fully offline Android ride-booking app using React Native, Expo, TypeScript, SQLite, and Zustand. No backend, no API keys, no real payments. The whole ride journey (book → match → ride → pay → rate → history) runs and persists entirely on-device.

**Start here → [`docs/README.md`](./docs/README.md)**

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — stack, folder structure, navigation, state, the trip state machine
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) — SQLite schema, seed data, fare formula
- [`docs/BUILD_AND_RUN.md`](./docs/BUILD_AND_RUN.md) — how to install, run in Expo Go, and build a real `.apk`
- [`docs/GO_LIVE.md`](./docs/GO_LIVE.md) — how to share the app with other people
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — honest breakdown of what's fully built vs. what's a deliberate demo boundary

## Quick start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on any Android phone. Demo OTP is `123456` — it's shown right on screen so you don't have to remember it.

## Build an APK

```bash
npm install -g eas-cli
eas login
npm run build:apk
```

EAS builds it in the cloud and hands you a download link. No Android Studio needed.
