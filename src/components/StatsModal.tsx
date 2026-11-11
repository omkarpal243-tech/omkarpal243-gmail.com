import React from 'react';
import { X, Trophy, MapPin, Camera, Video, Star, Compass, Calendar, Mountain } from 'lucide-react';
import { TripMemory } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: TripMemory[];
  upcomingTripsCount?: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, 
  onClose, 
  trips,
  upcomingTripsCount = 0 
}) => {
  if (!isOpen) return null;

  const totalTrips = trips.length;
  const totalPhotos = trips.reduce(
    (acc, t) => acc + t.files.filter((f) => f.type.startsWith('image/')).length,
    0
  );
  const totalVideos = trips.reduce(
    (acc, t) => acc + t.files.filter((f) => f.type.startsWith('video/')).length,
    0
  );
  const favoriteCount = trips.filter((t) => t.isFavorite).length;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  trips.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8df] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#edf0ec] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#e88b58] shadow-sm shrink-0 bg-neutral-900">
              <img
                src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                alt="Trekxplore45 Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-[#172b2b]">
                Trekxplore45 Journal Stats
              </h3>
              <p className="text-xs text-[#667777]">Your adventure milestones and collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-[#52635d] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#f6f5ef] border border-[#e8eee8]">
            <span className="text-xs font-bold text-[#667777] uppercase tracking-wider block mb-1">
              Completed Treks
            </span>
            <span className="text-3xl font-black text-[#172b2b]">{totalTrips}</span>
            <span className="text-[11px] text-[#245b50] block mt-1">Expeditions logged</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6f5ef] border border-[#e8eee8]">
            <span className="text-xs font-bold text-[#667777] uppercase tracking-wider block mb-1">
              Saved Media
            </span>
            <span className="text-3xl font-black text-[#e88b58]">{totalPhotos + totalVideos}</span>
            <span className="text-[11px] text-[#667777] block mt-1">
              {totalPhotos} photos · {totalVideos} videos
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6f5ef] border border-[#e8eee8]">
            <span className="text-xs font-bold text-[#667777] uppercase tracking-wider block mb-1">
              Starred Memories
            </span>
            <span className="text-3xl font-black text-rose-500">{favoriteCount}</span>
            <span className="text-[11px] text-[#667777] block mt-1">Bookmarked favorites</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6f5ef] border border-[#e8eee8]">
            <span className="text-xs font-bold text-[#667777] uppercase tracking-wider block mb-1">
              Upcoming Plans
            </span>
            <span className="text-3xl font-black text-[#245b50]">{upcomingTripsCount}</span>
            <span className="text-[11px] text-[#245b50] block mt-1">On the horizon</span>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryCounts).length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-3">
              Expedition Distribution
            </h4>
            <div className="space-y-2">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / totalTrips) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#52635d]">
                      <span className="capitalize">{cat}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e8eee8] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#245b50]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#edf0ec] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#245b50] text-white text-sm font-bold shadow-md cursor-pointer hover:bg-[#1b4332]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
