export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: any;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  address: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: 'apartment' | 'house' | 'villa' | 'studio';
  ownerId: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: any;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestCount: number;
  createdAt: any;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: any;
}
