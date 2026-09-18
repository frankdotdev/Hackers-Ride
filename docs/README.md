# Hacker's Ride — Documentation

**Hacker's Ride** is a fully offline, portfolio-grade ride-booking app I built with React Native, Expo, and TypeScript. It demonstrates an end-to-end ride-hailing product experience — account creation, ride booking, live driver simulation, payments, wallet, and trip history — with **no backend, no API keys, and no real payments**. Everything runs and persists locally on the device using SQLite.

> *"Your ride. Your route. Your way."*

This `docs/` folder is the source of truth for how I built it, how the data model works, how to run it, and how to get a build in front of other people.

## What's in here

| File | What it covers |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Tech stack, folder structure, navigation map, state management, the trip state machine |
| [`DATA_MODEL.md`](./DATA_MODEL.md) | SQLite schema, seed data, fare formula, promo code logic |
| [`BUILD_AND_RUN.md`](./BUILD_AND_RUN.md) | Installing dependencies, running in Expo Go / a simulator, building a real installable `.apk` |
| [`GO_LIVE.md`](./GO_LIVE.md) | The fastest ways to let someone else try the app — from a shareable Expo link to a downloadable APK |
| [`ROADMAP.md`](./ROADMAP.md) | What's fully built vs. what's a deliberate demo boundary, and what to add next |

## What's implemented

The complete primary customer journey works end-to-end, entirely on-device:

```
Welcome → Mobile Number → OTP (123456) → Account Created
  → Home (simulated live map) → Search Destination → Choose a Trip
  → Ride Now / Schedule for Later → Payment Method + Promo Code → Review Fare → Request Ride
  → Finding Driver → Driver Found (tap for full profile, real Call/Message) → Driver En Route → Driver Arrived
  → Start Trip → Simulated Driver Movement → Trip Complete
  → Rate Driver → Trips tab → Trip Details → Report Issue / Book Again
```

Every supporting surface is also fully wired: Wallet (balance, top-up, ledger), Payment Methods (add/remove/set default card), Safety Center (trusted contacts, ride-verification PIN, share trip), Help & Support (FAQ + live chat), Invite Friends (native share sheet), Profile (edit, saved places, notifications), Settings (light/dark mode, reset demo data), and full Android back-navigation via Expo Router's stack.

Everything is backed by a real local SQLite database (`expo-sqlite`) with seeded drivers, vehicle types, promo codes, and saved places — see `DATA_MODEL.md`.

## Why no backend

This is intentional. It's a **portfolio demonstration**, not a production dispatch platform. Every "driver," "payment," and "GPS position" is simulated deterministically on-device so the app is fully functional offline, safe to hand to anyone to install, and free to run — no server costs, no API keys to leak.
