import { TripMemory, UpcomingTrip } from '../types';

const DB_NAME = 'trekxplore45_memories';
const STORE = 'trips';
const UPCOMING_STORE = 'upcoming_trips';
const LEGACY_DB_NAME = 'wanderlog_memories';

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // Version 3 includes both memories and upcoming_trips stores
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(UPCOMING_STORE)) {
        db.createObjectStore(UPCOMING_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Migrate any memories from legacy wanderlog_memories if present
export async function migrateLegacyMemoriesIfNeeded(): Promise<void> {
  try {
    const dbs = await indexedDB.databases?.();
    const hasLegacy = dbs?.some(d => d.name === LEGACY_DB_NAME);
    if (!hasLegacy) return;

    const legacyDb = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(LEGACY_DB_NAME, 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!legacyDb.objectStoreNames.contains('trips')) {
      legacyDb.close();
      return;
    }

    const legacyTrips = await new Promise<any[]>((resolve, reject) => {
      const tx = legacyDb.transaction('trips', 'readonly');
      const req = tx.objectStore('trips').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    legacyDb.close();

    if (legacyTrips.length > 0) {
      const currentTrips = await getAllTrips();
      if (currentTrips.length === 0) {
        for (const trip of legacyTrips) {
          await saveTrip({
            place: trip.place,
            date: trip.date || '',
            category: 'trek',
            rating: 5,
            story: trip.story || '',
            files: trip.files || [],
            created: trip.created || Date.now(),
            isFavorite: false,
          });
        }
      }
    }
  } catch {
    // Ignore migration error silently
  }
}

// === MEMORIES (COMPLETED TRIPS) ===
export async function getAllTrips(): Promise<TripMemory[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const trips = (request.result as TripMemory[]) || [];
      // Sort newest created first
      resolve(trips.sort((a, b) => (b.created || 0) - (a.created || 0)));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveTrip(trip: Omit<TripMemory, 'id'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.add(trip);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function updateTrip(trip: TripMemory): Promise<void> {
  if (!trip.id) throw new Error('Trip ID is required for update');
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.put(trip);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTrip(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllTrips(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// === UPCOMING TRIPS ===
export async function getAllUpcomingTrips(): Promise<UpcomingTrip[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPCOMING_STORE, 'readonly');
    const store = tx.objectStore(UPCOMING_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const trips = (request.result as UpcomingTrip[]) || [];
      // Sort chronologically by startDate
      resolve(trips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveUpcomingTrip(trip: Omit<UpcomingTrip, 'id'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPCOMING_STORE, 'readwrite');
    const store = tx.objectStore(UPCOMING_STORE);
    const request = store.add(trip);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function updateUpcomingTrip(trip: UpcomingTrip): Promise<void> {
  if (!trip.id) throw new Error('Trip ID is required for update');
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPCOMING_STORE, 'readwrite');
    const store = tx.objectStore(UPCOMING_STORE);
    const request = store.put(trip);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteUpcomingTrip(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPCOMING_STORE, 'readwrite');
    const store = tx.objectStore(UPCOMING_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Curated sample upcoming expeditions for Trekxplore45
export const SAMPLE_UPCOMING_EXPEDITIONS: Omit<UpcomingTrip, 'id'>[] = [
  {
    destination: 'Kalsubai Night Trek',
    subtitle: 'Mount Everest of Maharashtra (1,646 m / 5,400 ft)',
    region: 'Bari Village, Igatpuri, Maharashtra',
    startDate: '2026-11-22',
    category: 'trek',
    status: 'booked',
    price: '₹999',
    registrationLink: 'https://forms.gle/du6wjKqJaRkNWhcK8',
    coverUrl: '/assets/aistudio/1793759244157_2__1__8444317f.jpeg',
    posterUrl: '/assets/aistudio/1793759244157_2__1__8444317f.jpeg',
    inclusions: [
      'Transport (To & Fro)',
      'Veg Breakfast & Morning Tea',
      'Experienced Trek Leaders',
      'Medic / First Aid Support',
    ],
    contacts: ['8080755443', '8591776019'],
    notes: 'Kalsubai is the highest peak in Maharashtra (1,646 meters / 5,400 ft). Trek through the starry night via historic steel ladders to reach the sacred Kalsubai Devi temple at the summit for an unforgettable sea-of-clouds sunrise above Bhandardara and Arthur Lake.',
    itinerary: [
      '10:30 PM (Sat): Boarding from Mumbai / Pune meeting points',
      '03:00 AM (Sun): Arrival at Bari village base camp & safety briefing',
      '03:30 AM: Begin night ascent with headlamps under starlit sky',
      '06:15 AM: Reach Kalsubai temple summit & witness breathtaking golden sunrise above clouds',
      '07:30 AM: Explore summit temple, group photos, and start descent',
      '10:30 AM: Reach base village & relish authentic hot Maharashtrian breakfast & tea',
      '03:30 PM: Journey back with thrilling memories of Maharashtra highest summit'
    ],
    checklist: [
      { id: '1', text: 'Headlamp / High-beam torch with fresh batteries (Mandatory)', completed: true },
      { id: '2', text: 'Trekking shoes with solid grip (Rubber sole recommended)', completed: true },
      { id: '3', text: '2-3 Litres water bottle per person', completed: true },
      { id: '4', text: 'Warm fleece jacket / windcheater (chilly at 5,400 ft summit)', completed: false },
      { id: '5', text: 'Energy bars, glucose / ORS, dry fruits', completed: false },
      { id: '6', text: 'Personal ID & emergency cash', completed: true },
    ],
    created: Date.now(),
  }
];

// Helper to make sure Kalsubai is seeded and cleanup removed trips
export async function ensureKalsubaiTrekSeeded(): Promise<void> {
  try {
    const existing = await getAllUpcomingTrips();

    // Clean up any old Annapurna or Iceland trips from DB
    for (const trip of existing) {
      const destLower = trip.destination.toLowerCase();
      if ((destLower.includes('annapurna') || destLower.includes('iceland')) && trip.id) {
        await deleteUpcomingTrip(trip.id);
      }
    }

    const updated = await getAllUpcomingTrips();
    const kalsubaiTrip = updated.find(
      (t) => t.destination.toLowerCase().includes('kalsubai') || t.coverUrl?.includes('8444317f')
    );

    if (!kalsubaiTrip) {
      await saveUpcomingTrip(SAMPLE_UPCOMING_EXPEDITIONS[0]);
    } else if (!kalsubaiTrip.registrationLink || kalsubaiTrip.registrationLink.includes('AqJ768NVfDd2Mw9y8')) {
      await updateUpcomingTrip({
        ...kalsubaiTrip,
        registrationLink: 'https://forms.gle/du6wjKqJaRkNWhcK8',
      });
    }
  } catch (e) {
    console.error('Error ensuring Kalsubai trek:', e);
  }
}

// Sample past adventures curated for Trekxplore45
export const SAMPLE_EXPEDITIONS: Omit<TripMemory, 'id'>[] = [
  {
    place: 'Manali & Hampta Pass, Himalayas',
    region: 'Himachal Pradesh, India',
    date: '2025-06-18',
    endDate: '2025-06-24',
    category: 'trek',
    rating: 5,
    story: 'Crossing over from the verdant Kullu Valley pine forests into the dramatic, barren moonscape of Spiti through 14,000 ft Hampta Pass. Camped right beside the turquoise glacial streams of Shea Goru beneath star-studded skies.',
    highlights: ['Hampta Pass 14,100ft', 'Shea Goru River Crossing', 'Chandra Taal Lake camp', 'High-altitude Chai'],
    isFavorite: true,
    files: [
      {
        name: 'himalayan-ridge.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sunrise over the misty Himalayan valleys'
      },
      {
        name: 'mountain-pass.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Glacial amphitheater approaching the summit pass'
      },
      {
        name: 'alpine-stream.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pure glacial snowmelt at Shea Goru'
      }
    ],
    created: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    place: 'Banff & Lake Moraine Trail',
    region: 'Alberta, Canadian Rockies',
    date: '2025-08-12',
    endDate: '2025-08-17',
    category: 'mountain',
    rating: 5,
    story: 'Hiked the Sentinel Pass trail between the Valley of the Ten Peaks. Unbelievable electric blue glacial waters at dawn with zero wind reflecting the towering quartz cliffs.',
    highlights: ['Sentinel Pass', 'Larch Valley', 'Electric turquoise waters', 'Canoeing Moraine Lake'],
    isFavorite: true,
    files: [
      {
        name: 'banff-lake.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mirror reflection on the glacial lake'
      },
      {
        name: 'canadian-rockies.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        caption: 'Alpine pine forest ridge trail'
      }
    ],
    created: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    place: 'Path of the Gods, Amalfi Coast',
    region: 'Campania, Italy',
    date: '2025-09-22',
    endDate: '2025-09-26',
    category: 'beach',
    rating: 5,
    story: 'Known locally as Sentiero degli Dei. Walked the cliffside high trail above the Tyrrhenian Sea from Bomerano to Nocelle. Terraced lemon groves, wild rosemary scented breezes, and endless azure ocean horizon.',
    highlights: ['Cliffside trail above clouds', 'Positano panorama', 'Fresh iced granita in Nocelle', 'Sunset swim'],
    isFavorite: false,
    files: [
      {
        name: 'amalfi-coast.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
        caption: 'The azure sea from Sentiero degli Dei'
      },
      {
        name: 'cliff-village.jpg',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
        caption: 'Positano pastel houses descending to the shore'
      }
    ],
    created: Date.now() - 1000 * 60 * 60 * 24 * 12,
  }
];
