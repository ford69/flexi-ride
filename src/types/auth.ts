export enum UserRole {
  USER = 'USER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPVerification {
  id: string;
  userId: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface CarListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
} 