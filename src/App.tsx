/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  getAllTrips, 
  saveTrip, 
  updateTrip, 
  deleteTrip, 
  clearAllTrips, 
  migrateLegacyMemoriesIfNeeded,
  getAllUpcomingTrips,
  saveUpcomingTrip,
  updateUpcomingTrip,
  deleteUpcomingTrip,
  SAMPLE_EXPEDITIONS,
  SAMPLE_UPCOMING_EXPEDITIONS,
  ensureKalsubaiTrekSeeded
} from './db/indexedDb';
import { TripMemory, TripCategory, LightboxState, UpcomingTrip } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UpcomingTripsSection } from './components/UpcomingTripsSection';
import { UpcomingTripModal } from './components/UpcomingTripModal';
import { TripForm } from './components/TripForm';
import { TripCard } from './components/TripCard';
import { MediaLightbox } from './components/MediaLightbox';
import { EditTripModal } from './components/EditTripModal';
import { StatsModal } from './components/StatsModal';
import { InstagramSection } from './components/InstagramSection';
import { InstagramModal } from './components/InstagramModal';
import { LeadershipSection } from './components/LeadershipSection';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Heart, 
  SlidersHorizontal, 
  Compass, 
  MapPin, 
  PlusCircle, 
  Check, 
  FolderDown,
  Instagram
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState<TripMemory[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<UpcomingTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'media'>('newest');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals state
  const [editingTrip, setEditingTrip] = useState<TripMemory | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [upcomingTripToEdit, setUpcomingTripToEdit] = useState<UpcomingTrip | null>(null);
  const [lightboxState, setLightboxState] = useState<LightboxState>({
    isOpen: false,
    tripTitle: '',
    files: [],
    currentIndex: 0,
  });

  // Load both memories and upcoming trips from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      await migrateLegacyMemoriesIfNeeded();
      const stored = await getAllTrips();
      setTrips(stored);

      await ensureKalsubaiTrekSeeded();
      let storedUpcoming = await getAllUpcomingTrips();
      // If user has no upcoming trips recorded, seed initial samples for high engagement
      if (storedUpcoming.length === 0) {
        for (const sample of SAMPLE_UPCOMING_EXPEDITIONS) {
          await saveUpcomingTrip(sample);
        }
        storedUpcoming = await getAllUpcomingTrips();
      }
      setUpcomingTrips(storedUpcoming);
    } catch (err) {
      console.error('Error fetching data from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Memory Handlers
  const handleSaveTrip = async (newTrip: Omit<TripMemory, 'id'>) => {
    await saveTrip(newTrip);
    await refreshData();
  };

  const handleUpdateTrip = async (updated: TripMemory) => {
    await updateTrip(updated);
    await refreshData();
  };

  const handleDeleteTrip = async (id: number) => {
    await deleteTrip(id);
    await refreshData();
  };

  const handleToggleFavorite = async (trip: TripMemory) => {
    await updateTrip({
      ...trip,
      isFavorite: !trip.isFavorite,
    });
    await refreshData();
  };

  const handleLoadSamples = async () => {
    for (const sample of SAMPLE_EXPEDITIONS) {
      await saveTrip(sample);
    }
    await refreshData();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all travel memories from Trekxplore45? This cannot be undone.')) {
      await clearAllTrips();
      await refreshData();
    }
  };

  // Upcoming Trips Handlers
  const handleSaveUpcomingTrip = async (newUpcoming: Omit<UpcomingTrip, 'id'>) => {
    await saveUpcomingTrip(newUpcoming);
    await refreshData();
  };

  const handleUpdateUpcomingTrip = async (updated: UpcomingTrip) => {
    await updateUpcomingTrip(updated);
    await refreshData();
  };

  const handleDeleteUpcomingTrip = async (id: number) => {
    await deleteUpcomingTrip(id);
    await refreshData();
  };

  const handleToggleChecklistItem = async (tripId: number, itemId: string) => {
    const target = upcomingTrips.find((t) => t.id === tripId);
    if (!target) return;

    const updatedChecklist = target.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    await updateUpcomingTrip({
      ...target,
      checklist: updatedChecklist,
    });
    await refreshData();
  };

  const handleLoadSampleUpcoming = async () => {
    for (const sample of SAMPLE_UPCOMING_EXPEDITIONS) {
      await saveUpcomingTrip(sample);
    }
    await refreshData();
  };

  const handleConvertToMemory = async (upcoming: UpcomingTrip) => {
    if (
      window.confirm(
        `Promote "${upcoming.destination}" to your Completed Memories Journal? You can then attach personal photos and videos!`
      )
    ) {
      // Save to past memories
      await saveTrip({
        place: upcoming.destination,
        region: upcoming.region,
        date: upcoming.startDate,
        endDate: upcoming.endDate,
        category: upcoming.category,
        rating: 5,
        story: upcoming.notes || 'Completed epic expedition!',
        highlights: upcoming.itinerary || [],
        files: upcoming.coverUrl
          ? [
              {
                name: `${upcoming.destination.toLowerCase().replace(/\s+/g, '-')}-cover.jpg`,
                type: 'image/jpeg',
                url: upcoming.coverUrl,
                caption: `Cover of expedition to ${upcoming.destination}`,
              },
            ]
          : [],
        created: Date.now(),
        isFavorite: false,
      });

      // Optionally delete from upcoming if it had an ID
      if (upcoming.id) {
        await deleteUpcomingTrip(upcoming.id);
      }

      await refreshData();
      scrollToSection('my-trips');
    }
  };

  const handleExport = () => {
    const exportData = {
      memories: trips.map((t) => ({
        place: t.place,
        region: t.region,
        date: t.date,
        endDate: t.endDate,
        category: t.category,
        rating: t.rating,
        story: t.story,
        highlights: t.highlights,
        mediaCount: t.files.length,
        created: t.created,
      })),
      upcoming: upcomingTrips,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trekxplore45-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenLightbox = (trip: TripMemory, initialIndex: number) => {
    const lightboxFiles = trip.files.map((f) => {
      let resolvedUrl = f.url || '';
      if (f.blob) {
        resolvedUrl = URL.createObjectURL(f.blob);
      }
      return {
        url: resolvedUrl,
        type: f.type,
        name: f.name,
        caption: f.caption,
      };
    }).filter((m) => !!m.url);

    setLightboxState({
      isOpen: true,
      tripTitle: trip.place,
      files: lightboxFiles,
      currentIndex: initialIndex,
    });
  };

  const totalMediaCount = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.files?.length || 0), 0);
  }, [trips]);

  // Filtered and sorted memory trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        if (onlyFavorites && !t.isFavorite) return false;
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesPlace = t.place.toLowerCase().includes(q);
          const matchesRegion = t.region?.toLowerCase().includes(q) || false;
          const matchesStory = t.story?.toLowerCase().includes(q) || false;
          const matchesHighlights = t.highlights?.some((h) => h.toLowerCase().includes(q)) || false;
          return matchesPlace || matchesRegion || matchesStory || matchesHighlights;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.created || 0) - (a.created || 0);
        if (sortBy === 'oldest') return (a.created || 0) - (b.created || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'media') return (b.files?.length || 0) - (a.files?.length || 0);
        return 0;
      });
  }, [trips, searchQuery, selectedCategory, sortBy, onlyFavorites]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5ef] text-[#172b2b]">
      {/* App Header with Trekxplore45 branding */}
      <Header
        tripCount={trips.length}
        upcomingCount={upcomingTrips.length}
        onOpenAddModal={() => scrollToSection('add-trip')}
        onLoadSamples={handleLoadSamples}
        onClearAll={handleClearAll}
        onExport={handleExport}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenInstagramQR={() => setIsInstagramModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        tripCount={trips.length}
        totalMediaCount={totalMediaCount}
        onScrollToAdd={() => scrollToSection('add-trip')}
        onScrollToMemories={() => scrollToSection('my-trips')}
        onLoadSamples={handleLoadSamples}
      />

      {/* Main Journal Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex-1 space-y-16 sm:space-y-20">
        {/* NEW: Upcoming Trips Section */}
        <UpcomingTripsSection
          trips={upcomingTrips}
          onOpenCreateModal={() => {
            setUpcomingTripToEdit(null);
            setIsUpcomingModalOpen(true);
          }}
          onEditTrip={(trip) => {
            setUpcomingTripToEdit(trip);
            setIsUpcomingModalOpen(true);
          }}
          onDeleteTrip={handleDeleteUpcomingTrip}
          onToggleChecklistItem={handleToggleChecklistItem}
          onConvertToMemory={handleConvertToMemory}
          onLoadSamples={handleLoadSampleUpcoming}
        />

        {/* Leadership & Core Contacts Section */}
        <LeadershipSection />

        {/* Official Instagram Community Section */}
        <InstagramSection onOpenQRModal={() => setIsInstagramModalOpen(true)} />

        {/* Add Trip Form Component */}
        <TripForm onSave={handleSaveTrip} />

        {/* Trips Collection Section */}
        <section id="my-trips" className="scroll-mt-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245b50]">
                <Compass className="w-3.5 h-3.5 text-[#e88b58]" />
                <span>Trekxplore45 Archive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172b2b] tracking-tight mt-1">
                My Travel Memories
              </h2>
              <p className="text-sm text-[#667777] mt-1">
                A growing collection of places, trails, and unforgettable moments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#dcebe3] text-[#245b50]">
                {trips.length} {trips.length === 1 ? 'trip' : 'trips'} logged
              </span>
              {trips.length > 0 && (
                <button
                  onClick={handleExport}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#d9e0d9] text-[#52635d] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Download Backup</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtering and Search Controls Bar */}
          <div className="bg-white rounded-2xl border border-[#e2e8df] p-4 mb-8 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-[#8fa799] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search destinations, stories, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-xs sm:text-sm font-medium text-[#172b2b] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667777] hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="md:col-span-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8fa799] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-xs sm:text-sm font-medium text-[#172b2b] outline-none cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="media">Sort: Most Photos & Videos</option>
                </select>
              </div>

              {/* Favorites Only Toggle */}
              <div className="md:col-span-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    onlyFavorites
                      ? 'bg-rose-50 border border-rose-200 text-rose-600'
                      : 'bg-[#fcfdfa] border border-[#d9e0d9] text-[#52635d] hover:bg-[#f4f7f4]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500' : ''}`} />
                  <span>Starred Only</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
              <span className="text-[#8fa799] font-medium mr-1 shrink-0">Filter:</span>
              {[
                { id: 'all', label: 'All Trips' },
                { id: 'trek', label: '🥾 Treks' },
                { id: 'mountain', label: '🏔️ Alpine' },
                { id: 'beach', label: '🌊 Coastal' },
                { id: 'camping', label: '⛺ Camping' },
                { id: 'roadtrip', label: '🚙 Road Trip' },
                { id: 'cultural', label: '🏛️ Heritage' },
                { id: 'city', label: '🏙️ City' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === pill.id
                      ? 'bg-[#245b50] text-white shadow-xs'
                      : 'bg-[#f4f7f4] text-[#52635d] hover:bg-[#e8eee8]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid or Empty State */}
          {isLoading ? (
            <div className="p-16 text-center text-[#667777] animate-pulse">
              Loading your Trekxplore45 journal...
            </div>
          ) : filteredTrips.length === 0 ? (
            /* Empty state matching the prototype with logo */
            <div className="bg-white rounded-3xl border border-dashed border-[#cbd7ce] p-10 sm:p-14 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#e88b58]/40 shadow-xl mx-auto mb-5 bg-neutral-900 group hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                  alt="Trekxplore45 Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {trips.length === 0 ? (
                <>
                  <h3 className="text-xl font-extrabold text-[#172b2b] mb-2">
                    Your journal is waiting for its first adventure ✈️
                  </h3>
                  <p className="text-sm text-[#667777] max-w-md mx-auto mb-6">
                    Add a trek or destination above to preserve your trail notes and media, or populate your journal with starter adventures to see how it looks.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => scrollToSection('add-trip')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#245b50] hover:bg-[#1b4332] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Your First Trip</span>
                    </button>
                    <button
                      onClick={handleLoadSamples}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fdf5ee] hover:bg-[#faebd7] text-[#d97745] font-bold text-sm border border-[#e88b58]/30 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Load Sample Treks</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold text-[#172b2b] mb-2">
                    No matching expeditions found
                  </h3>
                  <p className="text-sm text-[#667777] max-w-md mx-auto mb-6">
                    Try adjusting your search terms or clearing active category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setOnlyFavorites(false);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f4f7f4] hover:bg-[#e8eee8] text-[#245b50] font-bold text-xs cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id || trip.created}
                  trip={trip}
                  onDelete={handleDeleteTrip}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={setEditingTrip}
                  onOpenLightbox={handleOpenLightbox}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e2e8df] py-10 text-xs text-[#74827c]">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#e88b58] shadow-xs shrink-0">
                <img
                  src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                  alt="Trekxplore45 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-sm text-[#172b2b]">
                Trekxplore<span className="text-[#e88b58]">45</span>
              </span>
              <span>·</span>
              <span className="hidden sm:inline">Explore More. Trek Beyond.</span>
              <span>·</span>
              <span>Made for your memories 🌿</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#667777]">
              <a
                href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#b5179e] hover:text-[#e1306c] font-bold transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#e1306c]" />
                <span>@trekxplore45</span>
              </a>
              <span>·</span>
              <button
                onClick={() => setIsInstagramModalOpen(true)}
                className="hover:text-[#245b50] transition-colors cursor-pointer"
              >
                Instagram QR
              </button>
              <span>·</span>
              <a
                href="#leadership-team"
                onClick={() => scrollToSection('leadership-team')}
                className="hover:text-[#245b50] transition-colors"
              >
                Team
              </a>
              <span>·</span>
              <a
                href="#upcoming-trips"
                onClick={() => scrollToSection('upcoming-trips')}
                className="hover:text-[#245b50] transition-colors"
              >
                Upcoming ({upcomingTrips.length})
              </a>
              <span>·</span>
              <button
                onClick={() => setIsStatsOpen(true)}
                className="hover:text-[#245b50] transition-colors cursor-pointer"
              >
                Stats
              </button>
              <span>·</span>
              <button
                onClick={handleExport}
                className="hover:text-[#245b50] transition-colors cursor-pointer"
              >
                Export Journal
              </button>
              <span>·</span>
              <a
                href="#add-trip"
                onClick={() => scrollToSection('add-trip')}
                className="hover:text-[#245b50] transition-colors"
              >
                Log Trek
              </a>
            </div>
          </div>

          {/* Direct Leadership Contacts Strip */}
          <div className="pt-4 border-t border-[#edf0ec] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[#52635d]">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
              <span className="font-bold text-[#172b2b]">Direct Inquiries:</span>
              <span>
                <strong className="text-[#172b2b]">Rohit Kanojiya</strong> (Owner):{' '}
                <a href="tel:8080755443" className="font-semibold text-[#172b2b] hover:text-[#e88b58] underline decoration-dotted">
                  8080755443
                </a>
              </span>
              <span className="hidden sm:inline">|</span>
              <span>
                <strong className="text-[#172b2b]">Omkar Pal</strong> (CEO):{' '}
                <a href="tel:8591776019" className="font-semibold text-[#172b2b] hover:text-[#245b50] underline decoration-dotted">
                  8591776019
                </a>
              </span>
            </div>

            <div className="text-[11px] text-[#8fa799]">
              © {new Date().getFullYear()} Trekxplore45 · All Rights Reserved
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
      />

      <UpcomingTripModal
        isOpen={isUpcomingModalOpen}
        tripToEdit={upcomingTripToEdit}
        onClose={() => {
          setIsUpcomingModalOpen(false);
          setUpcomingTripToEdit(null);
        }}
        onSave={handleSaveUpcomingTrip}
        onUpdate={handleUpdateUpcomingTrip}
      />

      <MediaLightbox
        state={lightboxState}
        onClose={() =>
          setLightboxState((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onNavigate={(newIndex) =>
          setLightboxState((prev) => ({
            ...prev,
            currentIndex: newIndex,
          }))
        }
      />

      <EditTripModal
        trip={editingTrip}
        onClose={() => setEditingTrip(null)}
        onUpdate={handleUpdateTrip}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        trips={trips}
        upcomingTripsCount={upcomingTrips.length}
      />
    </div>
  );
}
