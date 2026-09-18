# Architecture

Here's how I structured the app and why I made each call.


| Layer | Choice | Why |
|---|---|---|
| Framework | React Native + Expo (SDK 51) | Fastest path to a real installable Android app, managed native modules (SQLite, Location, Sharing) without touching native code |
| Language | TypeScript | Type-safe domain model (`types/index.ts`) shared across store, screens, components |
| Routing | Expo Router (file-based) | Maps directly to the screen list in the product brief; groups like `(auth)` and `(tabs)` give free stack/tab nesting and correct Android back-button behavior |
| State | Zustand | Single global store, no boilerplate, easy to keep in sync with SQLite reads/writes |
| Persistence | `expo-sqlite` | Real relational storage on-device, survives app restarts, no backend |
| Icons | `lucide-react-native` | Clean vector icons matching the restrained, professional visual direction |
| Map | Custom `SimulatedMap` (SVG) | No Google Maps API key required; still renders roads, blocks, pickup/destination pins, nearby vehicle dots, and an animated route + moving car marker |

## Folder structure

```
app/                      # Expo Router screens (file path = route)
  _layout.tsx              # Root stack, DB init, theme, safe area
  index.tsx                 # Redirects to (auth) or (tabs) based on auth state
  (auth)/                  # welcome → phone → otp → success
  (tabs)/                  # Home, Trips, Wallet, Profile (bottom nav)
  location/search.tsx      # Pickup + destination search
  ride/                    # type → payment → summary → matching → active → completed → rating
  trip/[id].tsx             # Trip detail + Book Again
  wallet/topup.tsx
  profile/{settings,places,edit}.tsx

components/                # Reusable UI: Buttons, Cards (Vehicle/Driver/Trip/RatingStars), SimulatedMap
store/useAppStore.ts       # Single Zustand store — the only place screens read/write app state
database/db.ts             # Schema + seeding, runs once at app startup
data/seed.ts                # Vehicle types, drivers, promo codes, demo Enugu locations, fare math
theme/tokens.ts             # Light/dark design tokens, spacing, radius, typography
hooks/useTheme.ts           # Resolves current theme object from store's themeMode
types/index.ts              # Shared domain types (Ride, Driver, VehicleType, ...)
```

Screens never talk to SQLite directly — they call actions on `useAppStore`, which writes to SQLite and then reloads the in-memory slices (`loadFromDb`) so every screen re-renders with fresh data. This keeps the database as the single source of truth while screens stay simple.

## Navigation map

```
/                     → redirect based on auth
(auth)/welcome        → (auth)/phone → (auth)/otp → (auth)/success → (tabs)
(tabs)/index (Home)   → location/search → ride/type → ride/payment → ride/summary
                          → ride/matching → ride/active → ride/completed → ride/rating → (tabs)/trips
(tabs)/trips          → trip/[id] → (Book Again) → ride/type
(tabs)/wallet         → wallet/topup
(tabs)/profile        → profile/edit | profile/places | profile/settings
```

All modals (`location/search`, `ride/payment`, `wallet/topup`) use Expo Router's `presentation: "modal"` and standard Android back gestures; the driver-matching and active-trip screens disable the swipe-back gesture since those flows are state-machine driven.

## The trip state machine

A ride moves through a single `status` field, persisted in SQLite and mirrored in the store:

```
REQUESTED → DRIVER_MATCHED → DRIVER_EN_ROUTE → DRIVER_ARRIVED → TRIP_STARTED → TRIP_COMPLETED
                                                                              ↘ CANCELLED (from any pre-trip state)
(SCHEDULED is a separate branch for "ride later" bookings)
```

`ride/matching.tsx` advances `REQUESTED → DRIVER_MATCHED → DRIVER_EN_ROUTE` on timers, then hands off to `ride/active.tsx`, which handles `DRIVER_ARRIVED → TRIP_STARTED → TRIP_COMPLETED`. During `TRIP_STARTED`, a local interval advances a `progress` value from 0→1 that drives the animated vehicle marker in `SimulatedMap` along a cubic-bezier route between pickup and destination — this is the "simulated GPS movement" called for in the brief, with no real location data required.

## Design system

Tokens live in `theme/tokens.ts`: a near-black/white base with a single restrained green accent (`#1E8E5A` light / `#33B679` dark) used only for active/selected/success states, matching the "premium, minimal, no gradients, no neon" direction from the reference UI kit. Dark mode is a fully separate token set (not an inversion) with its own background/surface/card/border/accent values, toggled from Settings and persisted to SQLite.
