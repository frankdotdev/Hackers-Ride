import { create } from "zustand";
import { db } from "@/database/db";
import { AppUser, Place, Ride, RideStatus, WalletTransaction, NotificationItem, PaymentMethodType, PaymentMethodRecord, TrustedContact } from "@/types";
import { DRIVERS } from "@/data/seed";

interface AppState {
  // auth
  user: AppUser | null;
  isAuthenticated: boolean;
  pendingPhone: string;
  themeMode: "light" | "dark";

  // ride-in-progress (not yet persisted / mid-flow)
  draftPickup: Place | null;
  draftDestination: Place | null;
  draftRideTypeId: string | null;
  draftPaymentMethod: PaymentMethodType;
  draftPromoCode: string | null;
  draftScheduledAt: string | null;
  activeRideId: string | null;

  // data pulled from sqlite into memory for reactive UI
  savedPlaces: Place[];
  rides: Ride[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  notifications: NotificationItem[];
  paymentMethods: PaymentMethodRecord[];
  trustedContacts: TrustedContact[];

  // actions
  login: (phone: string) => void;
  verifyOtp: (code: string) => boolean;
  completeOnboarding: (firstName: string, lastName: string) => void;
  logout: () => void;
  setTheme: (mode: "light" | "dark") => void;

  setDraftPickup: (p: Place) => void;
  setDraftDestination: (p: Place) => void;
  setDraftRideType: (id: string) => void;
  setDraftPayment: (m: PaymentMethodType) => void;
  setDraftPromo: (code: string | null) => void;
  setDraftScheduledAt: (iso: string | null) => void;
  resetDraft: () => void;

  requestRide: (fare: number, distanceKm: number, durationMin: number, discount: number, scheduledAt?: string) => string;
  advanceRideStatus: (rideId: string, status: RideStatus) => void;
  cancelRide: (rideId: string, reason: string) => void;
  completeRide: (rideId: string, finalFare: number) => void;
  rateRide: (rideId: string, rating: number, tags: string[], comment: string) => void;
  reportIssue: (rideId: string, reason: string) => void;

  addSavedPlace: (p: Place) => void;
  removeSavedPlace: (id: string) => void;

  addWalletFunds: (amount: number) => void;
  debitWalletForRide: (amount: number, rideLabel: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (title: string, body: string) => void;

  addPaymentMethod: (last4: string) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  addTrustedContact: (name: string, phone: string) => void;
  removeTrustedContact: (id: string) => void;

  loadFromDb: () => void;
  resetDemoData: () => void;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function rowToRide(r: any): Ride {
  return {
    id: r.id,
    pickup: { id: "pickup", label: r.pickupLabel, address: r.pickupAddress, coords: { latitude: r.pickupLat, longitude: r.pickupLng } },
    destination: { id: "dest", label: r.destLabel, address: r.destAddress, coords: { latitude: r.destLat, longitude: r.destLng } },
    rideTypeId: r.rideTypeId,
    driverId: r.driverId,
    status: r.status,
    distanceKm: r.distanceKm,
    durationMin: r.durationMin,
    estimatedFare: r.estimatedFare,
    finalFare: r.finalFare ?? undefined,
    paymentMethod: r.paymentMethod,
    promoCode: r.promoCode ?? undefined,
    discount: r.discount ?? undefined,
    scheduledAt: r.scheduledAt ?? undefined,
    createdAt: r.createdAt,
    completedAt: r.completedAt ?? undefined,
    rating: r.rating ?? undefined,
    reviewTags: r.reviewTags ? JSON.parse(r.reviewTags) : undefined,
    reviewComment: r.reviewComment ?? undefined,
    cancelReason: r.cancelReason ?? undefined,
    reportedIssue: r.reportedIssue ?? undefined,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  pendingPhone: "",
  themeMode: "light",

  draftPickup: null,
  draftDestination: null,
  draftRideTypeId: null,
  draftPaymentMethod: "cash",
  draftPromoCode: null,
  draftScheduledAt: null,
  activeRideId: null,

  savedPlaces: [],
  rides: [],
  walletBalance: 0,
  walletTransactions: [],
  notifications: [],
  paymentMethods: [],
  trustedContacts: [],

  login: (phone) => set({ pendingPhone: phone }),

  verifyOtp: (code) => {
    if (code === "123456") {
      const id = uid("user");
      db.runSync("INSERT OR REPLACE INTO users (id, firstName, lastName, phone, email) VALUES (?,?,?,?,?)", [
        id, "New", "Rider", get().pendingPhone, "",
      ]);
      set({ user: { id, firstName: "New", lastName: "Rider", phone: get().pendingPhone }, isAuthenticated: true });
      get().pushNotification("Welcome to Hacker's Ride", "Your account has been created.");
      return true;
    }
    return false;
  },

  completeOnboarding: (firstName, lastName) => {
    const u = get().user;
    if (!u) return;
    const updated = { ...u, firstName, lastName };
    db.runSync("UPDATE users SET firstName=?, lastName=? WHERE id=?", [firstName, lastName, u.id]);
    set({ user: updated });
  },

  logout: () => set({ user: null, isAuthenticated: false, activeRideId: null }),

  setTheme: (mode) => {
    db.runSync("UPDATE settings SET theme=? WHERE id=1", [mode]);
    set({ themeMode: mode });
  },

  setDraftPickup: (p) => set({ draftPickup: p }),
  setDraftDestination: (p) => set({ draftDestination: p }),
  setDraftRideType: (id) => set({ draftRideTypeId: id }),
  setDraftPayment: (m) => set({ draftPaymentMethod: m }),
  setDraftPromo: (code) => set({ draftPromoCode: code }),
  setDraftScheduledAt: (iso) => set({ draftScheduledAt: iso }),
  resetDraft: () =>
    set({ draftPickup: null, draftDestination: null, draftRideTypeId: null, draftPromoCode: null, draftScheduledAt: null }),

  requestRide: (fare, distanceKm, durationMin, discount, scheduledAt) => {
    const { draftPickup, draftDestination, draftRideTypeId, draftPaymentMethod, draftPromoCode } = get();
    if (!draftPickup || !draftDestination || !draftRideTypeId) throw new Error("Incomplete ride draft");
    const id = uid("ride");
    const now = new Date().toISOString();
    const status: RideStatus = scheduledAt ? "SCHEDULED" : "REQUESTED";
    db.runSync(
      `INSERT INTO rides (id, pickupLabel, pickupAddress, pickupLat, pickupLng, destLabel, destAddress, destLat, destLng,
        rideTypeId, driverId, status, distanceKm, durationMin, estimatedFare, finalFare, paymentMethod, promoCode, discount,
        scheduledAt, createdAt, completedAt, rating, reviewTags, reviewComment, cancelReason, reportedIssue)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, draftPickup.label, draftPickup.address, draftPickup.coords.latitude, draftPickup.coords.longitude,
        draftDestination.label, draftDestination.address, draftDestination.coords.latitude, draftDestination.coords.longitude,
        draftRideTypeId, null, status, distanceKm, durationMin, fare, null, draftPaymentMethod, draftPromoCode, discount,
        scheduledAt ?? null, now, null, null, null, null, null, null,
      ]
    );
    set({ activeRideId: scheduledAt ? null : id });
    get().resetDraft();
    if (scheduledAt) {
      get().pushNotification("Ride scheduled", `Your ride is scheduled for ${new Date(scheduledAt).toLocaleString()}. Your driver will be assigned closer to your pickup time.`);
    }
    get().loadFromDb();
    return id;
  },

  advanceRideStatus: (rideId, status) => {
    let driverId = get().rides.find((r) => r.id === rideId)?.driverId;
    if (status === "DRIVER_MATCHED" && !driverId) {
      driverId = DRIVERS[Math.floor(Math.random() * DRIVERS.length)].id;
      db.runSync("UPDATE rides SET status=?, driverId=? WHERE id=?", [status, driverId, rideId]);
    } else {
      db.runSync("UPDATE rides SET status=? WHERE id=?", [status, rideId]);
    }
    get().loadFromDb();
  },

  cancelRide: (rideId, reason) => {
    db.runSync("UPDATE rides SET status='CANCELLED', cancelReason=? WHERE id=?", [reason, rideId]);
    set({ activeRideId: null });
    get().loadFromDb();
  },

  completeRide: (rideId, finalFare) => {
    const now = new Date().toISOString();
    db.runSync("UPDATE rides SET status='TRIP_COMPLETED', finalFare=?, completedAt=? WHERE id=?", [finalFare, now, rideId]);
    const ride = get().rides.find((r) => r.id === rideId);
    if (ride?.paymentMethod === "wallet") {
      get().debitWalletForRide(finalFare, `Ride to ${ride.destination.label}`);
    }
    get().pushNotification("Trip completed", `Your trip to ${ride?.destination.label ?? "your destination"} is complete.`);
    set({ activeRideId: null });
    get().loadFromDb();
  },

  rateRide: (rideId, rating, tags, comment) => {
    db.runSync("UPDATE rides SET rating=?, reviewTags=?, reviewComment=? WHERE id=?", [
      rating, JSON.stringify(tags), comment, rideId,
    ]);
    get().loadFromDb();
  },

  reportIssue: (rideId, reason) => {
    db.runSync("UPDATE rides SET reportedIssue=? WHERE id=?", [reason, rideId]);
    get().pushNotification("Report received", "Our team will review your report within 24 hours.");
    get().loadFromDb();
  },

  addSavedPlace: (p) => {
    db.runSync("INSERT OR REPLACE INTO saved_places (id, label, address, latitude, longitude, category) VALUES (?,?,?,?,?,?)", [
      p.id, p.label, p.address, p.coords.latitude, p.coords.longitude, p.category ?? "other",
    ]);
    get().loadFromDb();
  },

  removeSavedPlace: (id) => {
    db.runSync("DELETE FROM saved_places WHERE id=?", [id]);
    get().loadFromDb();
  },

  addWalletFunds: (amount) => {
    db.runSync("UPDATE wallet SET balance = balance + ? WHERE id=1", [amount]);
    db.runSync("INSERT INTO wallet_transactions (id, type, description, amount, createdAt) VALUES (?,?,?,?,?)", [
      uid("wt"), "topup", "Wallet top-up", amount, new Date().toISOString(),
    ]);
    get().pushNotification("Wallet funded", `₦${amount.toLocaleString()} added to your wallet.`);
    get().loadFromDb();
  },

  debitWalletForRide: (amount, rideLabel) => {
    db.runSync("UPDATE wallet SET balance = balance - ? WHERE id=1", [amount]);
    db.runSync("INSERT INTO wallet_transactions (id, type, description, amount, createdAt) VALUES (?,?,?,?,?)", [
      uid("wt"), "ride_payment", rideLabel, -amount, new Date().toISOString(),
    ]);
    get().loadFromDb();
  },

  markNotificationRead: (id) => {
    db.runSync("UPDATE notifications SET read=1 WHERE id=?", [id]);
    get().loadFromDb();
  },

  markAllNotificationsRead: () => {
    db.runSync("UPDATE notifications SET read=1");
    get().loadFromDb();
  },

  pushNotification: (title, body) => {
    db.runSync("INSERT INTO notifications (id, title, body, read, createdAt) VALUES (?,?,?,?,?)", [
      uid("notif"), title, body, 0, new Date().toISOString(),
    ]);
    get().loadFromDb();
  },

  addPaymentMethod: (last4) => {
    const id = uid("pm");
    db.runSync("INSERT INTO payment_methods (id, type, label, isDefault) VALUES (?,?,?,?)", [
      id, "card", `•••• ${last4}`, 0,
    ]);
    get().pushNotification("Card added", `Card ending in ${last4} was added to your account.`);
    get().loadFromDb();
  },

  removePaymentMethod: (id) => {
    const method = get().paymentMethods.find((m) => m.id === id);
    if (method?.type === "cash" || method?.type === "wallet") return; // cannot remove built-ins
    db.runSync("DELETE FROM payment_methods WHERE id=?", [id]);
    get().loadFromDb();
  },

  setDefaultPaymentMethod: (id) => {
    db.runSync("UPDATE payment_methods SET isDefault=0");
    db.runSync("UPDATE payment_methods SET isDefault=1 WHERE id=?", [id]);
    get().loadFromDb();
  },

  addTrustedContact: (name, phone) => {
    db.runSync("INSERT INTO trusted_contacts (id, name, phone) VALUES (?,?,?)", [uid("tc"), name, phone]);
    get().loadFromDb();
  },

  removeTrustedContact: (id) => {
    db.runSync("DELETE FROM trusted_contacts WHERE id=?", [id]);
    get().loadFromDb();
  },

  loadFromDb: () => {
    const places = db.getAllSync<any>("SELECT * FROM saved_places");
    const rides = db.getAllSync<any>("SELECT * FROM rides ORDER BY createdAt DESC");
    const wallet = db.getFirstSync<{ balance: number }>("SELECT balance FROM wallet WHERE id=1");
    const txns = db.getAllSync<any>("SELECT * FROM wallet_transactions ORDER BY createdAt DESC");
    const notifs = db.getAllSync<any>("SELECT * FROM notifications ORDER BY createdAt DESC");
    const settings = db.getFirstSync<{ theme: string }>("SELECT theme FROM settings WHERE id=1");
    const methods = db.getAllSync<any>("SELECT * FROM payment_methods");
    const contacts = db.getAllSync<any>("SELECT * FROM trusted_contacts");

    set({
      savedPlaces: places.map((p) => ({
        id: p.id, label: p.label, address: p.address,
        coords: { latitude: p.latitude, longitude: p.longitude }, category: p.category,
      })),
      rides: rides.map(rowToRide),
      walletBalance: wallet?.balance ?? 0,
      walletTransactions: txns.map((t) => ({ id: t.id, type: t.type, description: t.description, amount: t.amount, createdAt: t.createdAt })),
      notifications: notifs.map((n) => ({ id: n.id, title: n.title, body: n.body, read: !!n.read, createdAt: n.createdAt })),
      themeMode: (settings?.theme as "light" | "dark") ?? "light",
      paymentMethods: methods.map((m) => ({ id: m.id, type: m.type, label: m.label, isDefault: !!m.isDefault })),
      trustedContacts: contacts.map((c) => ({ id: c.id, name: c.name, phone: c.phone })),
    });
  },

  resetDemoData: () => {
    db.execSync(`
      DELETE FROM rides; DELETE FROM wallet_transactions; DELETE FROM notifications;
      DELETE FROM saved_places; DELETE FROM wallet; DELETE FROM settings;
      DELETE FROM payment_methods; DELETE FROM trusted_contacts;
    `);
    set({ user: null, isAuthenticated: false, activeRideId: null });
    const { initDatabase } = require("@/database/db");
    initDatabase();
    get().loadFromDb();
  },
}));
