export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "owner" | "admin";
  createdAt: string;
  token: string; // ✅ Add this line
  isVerified: boolean;
}

export interface Car {
  _id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  type: string;
  description: string;
  dailyRate: number;
  location: string;
  images: string[];
  features: string[];
  availability: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CarFilter {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dates?: {
    start: string;
    end: string;
  };
}
