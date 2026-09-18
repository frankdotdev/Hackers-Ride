import { Driver, PromoCode, VehicleType, Place } from "@/types";

// Enugu, Nigeria is used as the demo city center.
export const CITY_CENTER = { latitude: 6.4413, longitude: 7.4988 };

export const DEMO_PLACES: Place[] = [
  { id: "p1", label: "UNN (Nsukka Rd)", address: "University of Nigeria, Nsukka Road, Enugu", coords: { latitude: 6.8649, longitude: 7.3986 }, category: "popular" },
  { id: "p2", label: "Independence Layout", address: "Independence Layout, Enugu", coords: { latitude: 6.4531, longitude: 7.5185 }, category: "popular" },
  { id: "p3", label: "New Haven", address: "New Haven, Enugu", coords: { latitude: 6.4569, longitude: 7.5041 }, category: "popular" },
  { id: "p4", label: "Abakpa", address: "Abakpa Nike, Enugu", coords: { latitude: 6.4756, longitude: 7.5387 }, category: "popular" },
  { id: "p5", label: "GRA", address: "Government Reserved Area, Enugu", coords: { latitude: 6.4489, longitude: 7.4941 }, category: "popular" },
  { id: "p6", label: "Ogui Road", address: "Ogui Road, Enugu", coords: { latitude: 6.4462, longitude: 7.5093 }, category: "popular" },
  { id: "p7", label: "Trans-Ekulu", address: "Trans-Ekulu, Enugu", coords: { latitude: 6.4658, longitude: 7.5215 }, category: "popular" },
  { id: "p8", label: "Caritas University", address: "Caritas University, Amorji-Nike, Enugu", coords: { latitude: 6.4902, longitude: 7.5432 }, category: "popular" },
  { id: "p9", label: "Abakaliki Road", address: "Abakaliki Road, Enugu", coords: { latitude: 6.4701, longitude: 7.5309 }, category: "popular" },
];

export const VEHICLE_TYPES: VehicleType[] = [
  { id: "economy", name: "Hacker's Ride Economy", description: "Affordable everyday ride", capacity: 4, baseFare: 500, perKmRate: 150, perMinRate: 20, minimumFare: 1200, etaMins: 4, icon: "economy" },
  { id: "comfort", name: "Hacker's Ride Comfort", description: "Newer vehicle, extra legroom", capacity: 4, baseFare: 700, perKmRate: 190, perMinRate: 25, minimumFare: 1800, etaMins: 5, icon: "comfort" },
  { id: "xl", name: "Hacker's Ride XL", description: "Larger vehicle, 6 seats", capacity: 6, baseFare: 900, perKmRate: 230, perMinRate: 30, minimumFare: 2500, etaMins: 6, icon: "xl" },
  { id: "premium", name: "Hacker's Ride Premium", description: "Premium vehicle & driver", capacity: 4, baseFare: 1300, perKmRate: 300, perMinRate: 40, minimumFare: 3500, etaMins: 7, icon: "premium" },
  { id: "bike", name: "Hacker's Ride Bike", description: "Motorcycle, 1 passenger", capacity: 1, baseFare: 300, perKmRate: 90, perMinRate: 10, minimumFare: 700, etaMins: 3, icon: "bike" },
];

export const DRIVERS: Driver[] = [
  { id: "d1", name: "David Okafor", avatarSeed: "david-okafor", rating: 4.9, tripCount: 1820, vehicleModel: "Toyota Corolla", vehicleColor: "Black", licensePlate: "ENU 482 AB", memberSince: "2022", responseTimeSec: 25, phone: "+2348021110001" },
  { id: "d2", name: "Ngozi Eze", avatarSeed: "ngozi-eze", rating: 4.8, tripCount: 1340, vehicleModel: "Kia Rio", vehicleColor: "Silver", licensePlate: "ENU 117 KJ", memberSince: "2023", responseTimeSec: 30, phone: "+2348021110002" },
  { id: "d3", name: "Chidi Nwosu", avatarSeed: "chidi-nwosu", rating: 4.7, tripCount: 980, vehicleModel: "Hyundai Elantra", vehicleColor: "White", licensePlate: "ENU 903 QF", memberSince: "2023", responseTimeSec: 35, phone: "+2348021110003" },
  { id: "d4", name: "Amaka Obi", avatarSeed: "amaka-obi", rating: 5.0, tripCount: 2210, vehicleModel: "Toyota Camry", vehicleColor: "Grey", licensePlate: "ENU 275 ZL", memberSince: "2021", responseTimeSec: 22, phone: "+2348021110004" },
  { id: "d5", name: "Emeka Umeh", avatarSeed: "emeka-umeh", rating: 4.6, tripCount: 640, vehicleModel: "Honda Civic", vehicleColor: "Blue", licensePlate: "ENU 558 TR", memberSince: "2024", responseTimeSec: 40, phone: "+2348021110005" },
  { id: "d6", name: "Ifeoma Chukwu", avatarSeed: "ifeoma-chukwu", rating: 4.9, tripCount: 1560, vehicleModel: "Toyota Sienna", vehicleColor: "Black", licensePlate: "ENU 641 DN", memberSince: "2022", responseTimeSec: 28, phone: "+2348021110006" },
  { id: "d7", name: "Tunde Bakare", avatarSeed: "tunde-bakare", rating: 4.5, tripCount: 410, vehicleModel: "Bajaj Boxer", vehicleColor: "Red", licensePlate: "ENU 802 MC", memberSince: "2024", responseTimeSec: 15, phone: "+2348021110007" },
  { id: "d8", name: "Grace Adeyemi", avatarSeed: "grace-adeyemi", rating: 4.8, tripCount: 1120, vehicleModel: "Lexus ES", vehicleColor: "Black", licensePlate: "ENU 349 PX", memberSince: "2022", responseTimeSec: 32, phone: "+2348021110008" },
];

export const SAFETY_TIPS = [
  "Always confirm your driver's name, plate number and photo before entering the vehicle.",
  "Share your trip with a trusted contact for every ride.",
  "Sit in the back seat when riding alone.",
  "Verify the ride PIN with your driver before starting the trip.",
  "Trust your instincts — you can cancel a ride at any time, for any reason.",
];

export const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME500", description: "₦500 off your ride", kind: "flat", value: 500 },
  { code: "RIDE10", description: "10% off your ride", kind: "percent", value: 10 },
  { code: "FIRSTTRIP", description: "₦1,000 off your first trip", kind: "flat", value: 1000 },
  { code: "LOCAL20", description: "20% off your ride", kind: "percent", value: 20 },
];

export function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function estimateFare(vehicle: VehicleType, distanceKm: number, durationMin: number, surge = 1) {
  const raw = vehicle.baseFare + distanceKm * vehicle.perKmRate + durationMin * vehicle.perMinRate;
  return Math.max(Math.round(raw * surge), vehicle.minimumFare);
}

export function applyPromo(fare: number, promo?: PromoCode) {
  if (!promo) return { discount: 0, total: fare };
  const discount = promo.kind === "flat" ? promo.value : Math.round(fare * (promo.value / 100));
  return { discount: Math.min(discount, fare - 200), total: Math.max(fare - discount, 200) };
}
