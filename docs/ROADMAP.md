# What's built, what's left as a deliberate demo boundary

Updated after a second full pass where every previously-stubbed feature was implemented and the project was re-verified (`npm install`, `npx tsc --noEmit`, `npx expo export --platform android`) end-to-end.

## Fully built and functional

Everything in the original list, plus every item that was previously flagged as stubbed:

- Auth flow: welcome → phone entry (validated) → OTP (`123456`) → account created → persisted user in SQLite
- Home: simulated live map, and **working** Home/Work/Recent quick actions — Home/Work jump straight into booking using your saved address (and prompt you to add one if it doesn't exist yet), Recent reuses your last trip's destination
- Location search, ride type selection with live fares across 5 vehicle classes
- **Ride Now / Schedule for Later**: a real day/time picker (next 6 days, half-hour slots, automatically hides past times for today). Scheduled rides skip the matching simulation and land directly in Trips → Upcoming with a confirmation notification, exactly as specified
- Payment method selection reads from a **real, editable payment-methods table** instead of a hardcoded list
- **Payment Methods CRUD** (`/profile/payment-methods`): add a demo card (any 4 digits, no real card data ever collected), remove it, set any method as default — cash and wallet can't be deleted, matching how a real app would protect built-in methods
- Fare summary, driver matching, active trip with animated vehicle movement, trip completion, 5-star rating with tags/comment
- **Driver Profile sheet**: tap any driver card (matching, en route, or active trip) to see their full profile, verified badge, and working **Call**/**Message** buttons that open the device's real phone/SMS app via `Linking`
- **Share Trip**: uses `expo-sharing` for a real native share sheet (falls back gracefully to an alert if sharing isn't available on the device)
- **Report Issue**: a real reason-picker on Trip Details that persists to the ride record and shows the reported reason afterward
- Trips, Trip Details, Book Again, Wallet (balance/top-up/ledger), Profile
- **Invite Friends**: its own screen with copy-to-clipboard and a real native share sheet (`Share.share()`)
- **Safety Center** (`/profile/safety`): emergency notice (clearly marked as a demo, not connected to real services), a ride-verification PIN, **trusted contacts CRUD** (add/remove, persisted in SQLite), a Share-current-trip shortcut, and a safety tips list
- **Help & Support** (`/profile/help`): FAQ plus a working simulated support chat (canned agent replies, real message list state)
- Settings: light/dark mode, notification feed, links out to every sub-screen above, About, **Reset Demo Data**
- Full Android back-button behavior via Expo Router's native stack

## Deliberately out of scope (by design, not oversight)

These are the honest edges of what a **local-only, no-backend demo** can do:

- **Call/Message open the real phone/SMS app** with a demo number — they don't simulate an in-app call or a two-way text thread, since that would need a signaling backend
- **The map is a bundled SVG simulation**, not live satellite/street tiles — intentional per the brief, so no API key is ever required
- **Language, Privacy & Security, and Terms & Conditions** in Settings are present as real rows but open a short "this is a static demo screen" notice rather than full sub-flows, since there's no backend policy content to localize or enforce
- Contact Support's agent replies are canned, not an LLM — this is a UI/UX demonstration of the chat surface, not a live support integration

## Verification performed

- `npm install` — all dependencies resolve cleanly (1,233 packages)
- `npx tsc --noEmit` — zero TypeScript errors across the entire project
- `npx expo export --platform android` — a full Metro bundle build succeeds (2,719 modules, no resolution errors)

This catches type errors, broken imports, and bundler-level failures — the same class of issue that would otherwise only surface on a real device. It does **not** replace running the app on an actual phone/emulator, which is the last mile only you can do (see `BUILD_AND_RUN.md`) — but every screen, route, and store action in the app is now wired to something real, not a placeholder.
