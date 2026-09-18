# What's built, and what's a deliberate demo boundary

Here is an honest breakdown of what's fully built in the app vs. the parts I scoped out as demo boundaries.

## What's fully built and working

- **Auth flow:** welcome → phone entry (validated) → OTP (`123456`) → account created → user saved to SQLite
- **Home screen:** simulated live map with working quick actions:
  - **Home / Work** jump straight into booking using your saved address (or prompts to add one if you haven't yet)
  - **Recent** reuses your last trip's destination
- **Location search & vehicle selection:** live fare calculations across all 5 vehicle classes (Economy, Comfort, XL, Premium, Bike)
- **Ride Now / Schedule for Later:** includes a real date/time picker (next 6 days, half-hour intervals, auto-hiding past slots for today). Scheduled rides skip driver matching and land right in Trips → Upcoming with a confirmation notification
- **Payment Methods CRUD** (`/profile/payment-methods`): add a card (any 4 digits, demo only), remove cards, toggle default method. Cash and Wallet can't be deleted, just like real apps
- **Ride cycle:** fare summary → driver matching → en route → active trip with moving car animation → trip complete → 5-star rating with tags and comment
- **Driver Profile:** tap any driver card while matching, en route, or riding to view their full profile, badge, and working **Call** and **Message** buttons (opens your real phone/SMS app)
- **Share Trip:** uses native device sharing (`expo-sharing`)
- **Report an Issue:** pick a reason on Trip Details, saves directly to the ride record in SQLite
- **Trips & Trip Details:** full history list, filter by status, view trip receipts, and hit "Book Again" to re-order
- **Wallet:** current balance, top-up modal, and full transaction history ledger
- **Safety Center** (`/profile/safety`): ride verification PIN, emergency notice, and a **trusted contacts CRUD** (add/remove contacts saved in SQLite)
- **Help & Support** (`/profile/help`): searchable FAQs + simulated support chat with automated agent replies
- **Invite Friends:** referral code screen with one-tap copy and native share sheet
- **Settings & Theme:** persistent light/dark mode switch, notification feed, and a **Reset Demo Data** button that re-seeds everything cleanly
- **Navigation:** full Android hardware & gesture back-button support via Expo Router stack

## Deliberately scoped out (by design)

Since this is a standalone demo app that runs completely offline without a server:

- **Call/Message open your phone's dialer/SMS app** with demo numbers rather than simulating VoIP or a 2-way chat backend
- **The map is an interactive SVG simulation** instead of Google/Apple Maps tiles, so anyone can clone and run this without needing paid API keys
- **Static policy screens** (Language, Privacy, Terms) show a quick demo modal rather than multi-page legal documents
- **Support chat uses canned simulated replies** rather than an LLM or live agent backend

## Verification

I ran full sanity checks to ensure clean builds:
- `npm install` — clean dependency tree
- `npx tsc --noEmit` — zero TypeScript errors across all screens and components
- `npx expo prebuild` — verified Android project generation succeeds with app icons and configuration
