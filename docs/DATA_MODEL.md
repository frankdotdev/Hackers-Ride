# Data Model

All data lives in a single on-device SQLite database, `hackers_ride.db`, created and seeded on first launch by `database/db.ts`.

## Tables

| Table | Purpose |
|---|---|
| `users` | The single demo account created after OTP verification |
| `saved_places` | Home/Work/custom places (seeded with a Home and Work entry) |
| `rides` | Every ride: pickup/destination, type, driver, status, fare, promo, rating, timestamps |
| `wallet` | Single-row balance (seeded at ₦18,500) |
| `wallet_transactions` | Ledger of top-ups, ride payments, refunds, promo credits |
| `notifications` | In-app notification feed with read/unread state |
| `payment_methods` | Cash, Wallet, and a demo saved card (`•••• 4821`) — no real card data ever stored |
| `promo_codes` | The four demo codes below |
| `settings` | Persisted theme (`light`/`dark`) |

`ride_events` / `ride_locations` from the original brief are intentionally folded into the `rides.status` field plus the client-side animation in `SimulatedMap` rather than a separate event-log table — see `ROADMAP.md` for extending this into a full event history if needed.

## Vehicle types & fare formula

Defined in `data/seed.ts` (`VEHICLE_TYPES`). Fare is fully deterministic and computed client-side:

```
fare = max(baseFare + distanceKm * perKmRate + durationMin * perMinRate, minimumFare)
```

| Ride type | Base | Per km | Per min | Minimum |
|---|---|---|---|---|
| Economy | ₦500 | ₦150 | ₦20 | ₦1,200 |
| Comfort | ₦700 | ₦190 | ₦25 | ₦1,800 |
| XL | ₦900 | ₦230 | ₦30 | ₦2,500 |
| Premium | ₦1,300 | ₦300 | ₦40 | ₦3,500 |
| Bike | ₦300 | ₦90 | ₦10 | ₦700 |

Distance is computed with the haversine formula between the pickup and destination coordinates (`data/seed.ts#haversineKm`); duration is approximated as `distanceKm * 2.6` minutes, floored at 6 minutes.

## Promo codes

| Code | Effect |
|---|---|
| `WELCOME500` | ₦500 flat off |
| `RIDE10` | 10% off |
| `FIRSTTRIP` | ₦1,000 flat off |
| `LOCAL20` | 20% off |

Unknown codes show "Promo code not recognized." and never crash the flow (`applyPromo` in `data/seed.ts` caps discount so the fare never drops below ₦200).

## Drivers

Eight fictional drivers with Nigerian names, ratings, trip counts, and vehicle details (`data/seed.ts#DRIVERS`). A driver is assigned pseudo-randomly the moment a ride reaches `DRIVER_MATCHED`.

## Demo locations

Nine real Enugu-area landmarks (UNN, Independence Layout, New Haven, Abakpa, GRA, Ogui Road, Trans-Ekulu, Caritas University, Abakaliki Road) are used as the searchable destination set, with the city center anchored near Enugu, Nigeria. These are illustrative demo coordinates, not a live geocoding integration.

## Resetting data

Settings → **Reset Demo Data** drops and re-seeds every table except the schema itself, and logs the user out — useful before a live demo so the app starts from a clean state every time.
