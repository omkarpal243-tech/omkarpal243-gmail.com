import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Trash2, 
  Heart, 
  Play, 
  Maximize2, 
  Camera, 
  Video as VideoIcon,
  Compass,
  Edit3,
  Share2
} from 'lucide-react';
import { TripMemory, MediaFileRecord } from '../types';

interface TripCardProps {
  trip: TripMemory;
  onDelete: (id: number) => void;
  onToggleFavorite: (trip: TripMemory) => void;
  onEdit: (trip: TripMemory) => void;
  onOpenLightbox: (trip: TripMemory, initialIndex: number) => void;
}

interface ResolvedMedia {
  url: string;
  type: string;
  name: string;
  caption?: string;
  isBlob: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDelete,
  onToggleFavorite,
  onEdit,
  onOpenLightbox,
}) => {
  const [resolvedMedia, setResolvedMedia] = useState<ResolvedMedia[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Convert blobs to object URLs safely
  useEffect(() => {
    const urlsToRevoke: string[] = [];
    const mediaList: ResolvedMedia[] = trip.files.map((file) => {
      if (file.blob) {
        const url = URL.createObjectURL(file.blob);
        urlsToRevoke.push(url);
        return {
          url,
          type: file.type,
          name: file.name,
          caption: file.caption,
          isBlob: true,
        };
      } else if (file.url) {
        return {
          url: file.url,
          type: file.type || 'image/jpeg',
          name: file.name,
          caption: file.caption,
          isBlob: false,
        };
      }
      return {
        url: '',
        type: file.type || 'image/jpeg',
        name: file.name,
        isBlob: false,
      };
    }).filter((m) => !!m.url);

    setResolvedMedia(mediaList);

    return () => {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [trip.files]);

  const formatDate = (dateStr: string, endDateStr?: string) => {
    if (!dateStr) return 'Date not specified';
    try {
      const d1 = new Date(dateStr + 'T12:00:00');
      const startFormatted = d1.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      if (!endDateStr) return startFormatted;

      const d2 = new Date(endDateStr + 'T12:00:00');
      const endFormatted = d2.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return `${startFormatted} – ${endFormatted}`;
    } catch {
      return dateStr;
    }
  };

  const photoCount = trip.files.filter((f) => f.type.startsWith('image/')).length;
  const videoCount = trip.files.filter((f) => f.type.startsWith('video/')).length;

  return (
    <article className="group bg-white rounded-2xl sm:rounded-3xl border border-[#e2e8df] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Media Gallery Grid */}
        <div className="relative bg-[#e8eee8] overflow-hidden select-none">
          {resolvedMedia.length === 0 ? (
            /* Media Placeholder */
            <div className="h-48 sm:h-52 flex flex-col items-center justify-center text-[#6b8175] bg-gradient-to-b from-[#f2f7f4] to-[#e4ede7]">
              <Compass className="w-10 h-10 text-[#8fa799] stroke-[1.5] mb-2 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6b8175]">
                Trekxplore45 Journey
              </span>
            </div>
          ) : resolvedMedia.length === 1 ? (
            /* Single Hero Media */
            <div
              onClick={() => onOpenLightbox(trip, 0)}
              className="relative h-56 sm:h-64 cursor-pointer overflow-hidden group/item"
            >
              {resolvedMedia[0].type.startsWith('video/') ? (
                <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                  <video
                    src={resolvedMedia[0].url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/35 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#172b2b] flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#172b2b] ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={resolvedMedia[0].url}
                  alt={trip.place}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : resolvedMedia.length === 2 ? (
            /* 2 Columns Media Grid */
            <div className="grid grid-cols-2 gap-1 h-52 sm:h-56">
              {resolvedMedia.slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenLightbox(trip, idx)}
                  className="relative h-full cursor-pointer overflow-hidden group/item"
                >
                  {item.type.startsWith('video/') ? (
                    <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                      <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
                      <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white drop-shadow fill-white/80" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`${trip.place} ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* 3 or 4+ Media Grid */
            <div className="grid grid-cols-2 gap-1 h-52 sm:h-56">
              {resolvedMedia.slice(0, 4).map((item, idx) => {
                const isFourth = idx === 3;
                const remaining = resolvedMedia.length - 4;

                return (
                  <div
                    key={idx}
                    onClick={() => onOpenLightbox(trip, idx)}
                    className="relative h-[103px] sm:h-[110px] cursor-pointer overflow-hidden group/item"
                  >
                    {item.type.startsWith('video/') ? (
                      <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                        <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
                        <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/30 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white drop-shadow fill-white/80" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`${trip.place} ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />
                    )}

                    {isFourth && remaining > 0 && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm">
                        +{remaining} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Favorite Button */}
          <button
            onClick={() => onToggleFavorite(trip)}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
              trip.isFavorite
                ? 'bg-rose-500/90 text-white shadow-md'
                : 'bg-white/80 text-[#52635d] hover:bg-white hover:text-rose-500'
            }`}
            title={trip.isFavorite ? 'Bookmarked' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${trip.isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Floating Star Rating Overlay Pill */}
          <div 
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-black shadow-md z-10"
            title={`${trip.rating || 5} / 5 Stars`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black">{trip.rating || 5}.0</span>
          </div>

          {/* Category Tag pill overlay */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
            {trip.category}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          {/* Header Row: Title & Visual 1-5 Stars Display */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-extrabold text-lg sm:text-xl text-[#172b2b] tracking-tight line-clamp-1 group-hover:text-[#245b50] transition-colors flex-1">
              {trip.place}
            </h3>

            {/* Visual 1-5 Star Rating Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 border border-amber-200/90 shadow-2xs shrink-0"
              title={`Rated ${trip.rating || 5} out of 5 stars`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= (trip.rating || 5)
                        ? 'fill-amber-400 text-amber-500 drop-shadow-[0_1px_1px_rgba(245,158,11,0.25)]'
                        : 'fill-transparent text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-amber-950">
                {trip.rating || 5}.0
              </span>
            </div>
          </div>

          {/* Region / Subtitle */}
          {trip.region && (
            <div className="flex items-center gap-1.5 text-xs text-[#52635d] font-medium mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#245b50] shrink-0" />
              <span className="truncate">{trip.region}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-[#788782] mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#8fa799] shrink-0" />
            <span>{formatDate(trip.date, trip.endDate)}</span>
          </div>

          {/* Story */}
          <div className="text-sm text-[#52635d] leading-relaxed mb-4">
            <p className={isExpanded ? 'whitespace-pre-line' : 'line-clamp-3 whitespace-pre-line'}>
              {trip.story || 'A breathtaking adventure documented in Trekxplore45.'}
            </p>
            {trip.story && trip.story.length > 140 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-[#245b50] hover:text-[#1b4332] mt-1.5 underline cursor-pointer"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Highlights Chips */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {trip.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#f4f7f4] text-[#245b50] font-medium"
                >
                  #{h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Foot */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#fcfdfa] border-t border-[#edf0ec] flex items-center justify-between">
        {/* Media count */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#718078]">
          {photoCount > 0 && (
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#245b50]" />
              {photoCount}
            </span>
          )}
          {videoCount > 0 && (
            <span className="flex items-center gap-1">
              <VideoIcon className="w-3.5 h-3.5 text-[#e88b58]" />
              {videoCount}
            </span>
          )}
          {photoCount === 0 && videoCount === 0 && (
            <span>No media</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(trip)}
            className="p-1.5 rounded-lg text-[#52635d] hover:bg-[#dcebe3] hover:text-[#245b50] transition-colors cursor-pointer"
            title="Edit memory"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
              <span className="text-[11px] text-rose-700 font-bold">Delete?</span>
              <button
                type="button"
                onClick={() => trip.id && onDelete(trip.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 underline px-1 cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#667777] hover:text-black px-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#fff0eb] text-[#a64c32] hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
