export type TripCategory = 
  | 'trek'
  | 'mountain'
  | 'beach'
  | 'roadtrip'
  | 'camping'
  | 'cultural'
  | 'city'
  | 'wildlife'
  | 'other';

export interface MediaFileRecord {
  name: string;
  type: string;
  blob?: Blob;
  url?: string; // used for preview or sample trips
  caption?: string;
  size?: number;
}

export interface TripMemory {
  id?: number;
  place: string;
  region?: string;
  date: string;
  endDate?: string;
  category: TripCategory;
  rating: number; // 1-5
  story: string;
  highlights?: string[];
  isFavorite?: boolean;
  files: MediaFileRecord[];
  created: number;
}

export interface LightboxState {
  isOpen: boolean;
  tripTitle: string;
  files: { url: string; type: string; name: string; caption?: string }[];
  currentIndex: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface UpcomingTrip {
  id?: number;
  destination: string;
  subtitle?: string;
  region?: string;
  startDate: string;
  endDate?: string;
  category: TripCategory;
  status: 'planning' | 'booked' | 'ready';
  coverUrl?: string;
  posterUrl?: string;
  price?: string;
  inclusions?: string[];
  contacts?: string[];
  registrationLink?: string;
  notes?: string;
  itinerary?: string[];
  checklist: ChecklistItem[];
  created: number;
}


