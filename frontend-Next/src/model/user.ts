export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  language?: string;
  memberSince?: string;
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints?: number;
}

export interface Address {
  id: number;
  type: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface UserState {
  user: User | null;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  isAuthenticated: boolean;
}
