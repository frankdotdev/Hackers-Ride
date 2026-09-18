export type RideStatus =
  | "REQUESTED"
  | "DRIVER_MATCHED"
  | "DRIVER_EN_ROUTE"
  | "DRIVER_ARRIVED"
  | "TRIP_STARTED"
  | "TRIP_COMPLETED"
  | "CANCELLED"
  | "SCHEDULED";

export type PaymentMethodType = "cash" | "card" | "wallet";

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  label: string;
  address: string;
  coords: LatLng;
  category?: "home" | "work" | "recent" | "popular" | "other";
}

export interface VehicleType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minimumFare: number;
  etaMins: number;
  icon: "economy" | "comfort" | "xl" | "premium" | "bike";
}

export interface Driver {
  id: string;
  name: string;
  avatarSeed: string;
  rating: number;
  tripCount: number;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  memberSince: string;
  responseTimeSec: number;
  phone: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export interface PaymentMethodRecord {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault: boolean;
}

export interface PromoCode {
  code: string;
  description: string;
  kind: "flat" | "percent";
  value: number;
}

export interface WalletTransaction {
  id: string;
  type: "topup" | "ride_payment" | "refund" | "promo_credit";
  description: string;
  amount: number; // positive = credit, negative = debit
  createdAt: string;
}

export interface Ride {
  id: string;
  pickup: Place;
  destination: Place;
  rideTypeId: string;
  driverId?: string;
  status: RideStatus;
  distanceKm: number;
  durationMin: number;
  estimatedFare: number;
  finalFare?: number;
  paymentMethod: PaymentMethodType;
  promoCode?: string;
  discount?: number;
  scheduledAt?: string;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  reviewTags?: string[];
  reviewComment?: string;
  cancelReason?: string;
  reportedIssue?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}
