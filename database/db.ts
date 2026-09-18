import * as SQLite from "expo-sqlite";
import { PROMO_CODES } from "@/data/seed";

const db = SQLite.openDatabaseSync("hackers_ride.db");

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firstName TEXT, lastName TEXT, phone TEXT, email TEXT
    );

    CREATE TABLE IF NOT EXISTS saved_places (
      id TEXT PRIMARY KEY,
      label TEXT, address TEXT, latitude REAL, longitude REAL, category TEXT
    );

    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      pickupLabel TEXT, pickupAddress TEXT, pickupLat REAL, pickupLng REAL,
      destLabel TEXT, destAddress TEXT, destLat REAL, destLng REAL,
      rideTypeId TEXT, driverId TEXT, status TEXT,
      distanceKm REAL, durationMin REAL,
      estimatedFare INTEGER, finalFare INTEGER,
      paymentMethod TEXT, promoCode TEXT, discount INTEGER,
      scheduledAt TEXT, createdAt TEXT, completedAt TEXT,
      rating INTEGER, reviewTags TEXT, reviewComment TEXT, cancelReason TEXT,
      reportedIssue TEXT
    );

    CREATE TABLE IF NOT EXISTS trusted_contacts (
      id TEXT PRIMARY KEY,
      name TEXT, phone TEXT
    );

    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      balance INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      type TEXT, description TEXT, amount INTEGER, createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT, body TEXT, read INTEGER, createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      type TEXT, label TEXT, isDefault INTEGER
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      description TEXT, kind TEXT, value INTEGER
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      theme TEXT NOT NULL DEFAULT 'light'
    );
  `);

  seedIfEmpty();
}

function seedIfEmpty() {
  const wallet = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM wallet");
  if (!wallet || wallet.c === 0) {
    db.runSync("INSERT INTO wallet (id, balance) VALUES (1, ?)", [18500]);
    db.runSync(
      "INSERT INTO wallet_transactions (id, type, description, amount, createdAt) VALUES (?,?,?,?,?)",
      ["wt-seed-1", "topup", "Welcome bonus", 18500, new Date().toISOString()]
    );
  }

  const settings = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM settings");
  if (!settings || settings.c === 0) {
    db.runSync("INSERT INTO settings (id, theme) VALUES (1, 'light')");
  }

  const promos = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM promo_codes");
  if (!promos || promos.c === 0) {
    for (const p of PROMO_CODES) {
      db.runSync(
        "INSERT INTO promo_codes (code, description, kind, value) VALUES (?,?,?,?)",
        [p.code, p.description, p.kind, p.value]
      );
    }
  }

  const pm = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM payment_methods");
  if (!pm || pm.c === 0) {
    db.runSync("INSERT INTO payment_methods (id, type, label, isDefault) VALUES (?,?,?,?)", ["pm-cash", "cash", "Cash", 1]);
    db.runSync("INSERT INTO payment_methods (id, type, label, isDefault) VALUES (?,?,?,?)", ["pm-wallet", "wallet", "Wallet", 0]);
    db.runSync("INSERT INTO payment_methods (id, type, label, isDefault) VALUES (?,?,?,?)", ["pm-card", "card", "•••• 4821", 0]);
  }

  const places = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM saved_places");
  if (!places || places.c === 0) {
    db.runSync(
      "INSERT INTO saved_places (id, label, address, latitude, longitude, category) VALUES (?,?,?,?,?,?)",
      ["home", "Home", "12 Garden Avenue, Independence Layout, Enugu", 6.4531, 7.5185, "home"]
    );
    db.runSync(
      "INSERT INTO saved_places (id, label, address, latitude, longitude, category) VALUES (?,?,?,?,?,?)",
      ["work", "Work", "Agency HQ, Ogui Road, Enugu", 6.4462, 7.5093, "work"]
    );
  }

  const notifs = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM notifications");
  if (!notifs || notifs.c === 0) {
    db.runSync(
      "INSERT INTO notifications (id, title, body, read, createdAt) VALUES (?,?,?,?,?)",
      ["n1", "Welcome to Hacker's Ride", "Your account is ready. Book your first ride any time.", 0, new Date().toISOString()]
    );
  }
}

export { db };
