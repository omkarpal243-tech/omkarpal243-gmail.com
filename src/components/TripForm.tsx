import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Star, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  Tag,
  Mountain,
  Waves,
  Car,
  Tent,
  Landmark,
  Building2,
  TreePine
} from 'lucide-react';
import { TripCategory, TripMemory, MediaFileRecord } from '../types';

interface TripFormProps {
  onSave: (trip: Omit<TripMemory, 'id'>) => Promise<void>;
}

const CATEGORIES: { id: TripCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'trek', label: 'Trek & Hike', icon: <Mountain className="w-4 h-4" /> },
  { id: 'mountain', label: 'Alpine Peak', icon: <Compass className="w-4 h-4" /> },
  { id: 'beach', label: 'Coast & Beach', icon: <Waves className="w-4 h-4" /> },
  { id: 'camping', label: 'Wilderness & Camp', icon: <Tent className="w-4 h-4" /> },
  { id: 'roadtrip', label: 'Road Trip', icon: <Car className="w-4 h-4" /> },
  { id: 'cultural', label: 'Heritage & Culture', icon: <Landmark className="w-4 h-4" /> },
  { id: 'city', label: 'City Escape', icon: <Building2 className="w-4 h-4" /> },
  { id: 'wildlife', label: 'Safari & Nature', icon: <TreePine className="w-4 h-4" /> },
];

const POPULAR_SUGGESTIONS = [
  'Manali & Solang Valley, India',
  'Banff & Lake Louise, Canada',
  'Amalfi Coast Trail, Italy',
  'Kyoto Bamboo Groves, Japan',
  'Dolomites Alta Via, Italy',
  'Patagonia Fitz Roy, Argentina',
];

const RATING_LEVELS: Record<number, { label: string; tag: string; description: string }> = {
  1: { label: '1 Star · Tough Trail', tag: 'Challenging', description: 'Tough conditions or gruelling ascent' },
  2: { label: '2 Stars · Fair Adventure', tag: 'Fair', description: 'Modest trail with some scenic spots' },
  3: { label: '3 Stars · Good Expedition', tag: 'Good', description: 'Fun trail and solid highlights' },
  4: { label: '4 Stars · Great Adventure', tag: 'Great', description: 'Wonderful views, highly memorable' },
  5: { label: '5 Stars · Legendary Adventure!', tag: 'Legendary', description: 'Unforgettable, bucket-list perfection' },
};

interface SelectedFilePreview {
  file: File;
  previewUrl: string;
  name: string;
  type: string;
  size: number;
}

export const TripForm: React.FC<TripFormProps> = ({ onSave }) => {
  const [place, setPlace] = useState('');
  const [region, setRegion] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<TripCategory>('trek');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [story, setStory] = useState('');
  const [selectedPreviews, setSelectedPreviews] = useState<SelectedFilePreview[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'saving' | 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const validFiles: SelectedFilePreview[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const previewUrl = URL.createObjectURL(file);
        validFiles.push({
          file,
          previewUrl,
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
    });

    setSelectedPreviews((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedPreviews((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) return;

    try {
      setIsSubmitting(true);
      setStatusMessage({ type: 'saving', text: 'Saving memory to Trekxplore45...' });

      // Convert selected file previews into MediaFileRecords with Blobs
      const mediaFiles: MediaFileRecord[] = selectedPreviews.map((p) => ({
        name: p.name,
        type: p.type,
        blob: p.file,
        size: p.size,
      }));

      await onSave({
        place: place.trim(),
        region: region.trim() || undefined,
        date,
        endDate: endDate || undefined,
        category,
        rating,
        story: story.trim(),
        files: mediaFiles,
        created: Date.now(),
        isFavorite: false,
      });

      setStatusMessage({ type: 'success', text: 'Memory saved successfully to your Trekxplore45 journal! 🌿' });

      // Clean up preview object URLs
      selectedPreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl));

      // Reset form
      setPlace('');
      setRegion('');
      setStory('');
      setEndDate('');
      setRating(5);
      setHoverRating(null);
      setSelectedPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to save trip memory. Browser storage might be constrained.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div id="add-trip" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245b50]">
            <Sparkles className="w-3.5 h-3.5 text-[#e88b58]" />
            <span>Trekxplore45 Log Book</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172b2b] tracking-tight mt-1">
            Add a New Travel Memory
          </h2>
          <p className="text-sm text-[#667777] mt-1">
            Every trek, trail, and scenic detour deserves a permanent spot in your journal.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Destination / Place */}
          <div className="md:col-span-1">
            <label htmlFor="place-input" className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
              Place / Destination Visited <span className="text-[#e88b58]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#245b50] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="place-input"
                type="text"
                required
                maxLength={90}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="e.g. Manali, Hampta Pass Ridge"
                className="w-full pl-10 pr-4 py-3 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] focus:ring-2 focus:ring-[#245b50]/15 rounded-xl text-sm font-medium text-[#172b2b] transition-all outline-none"
              />
            </div>

            {/* Quick Inspiration chips */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#667777] font-medium mr-1">Try:</span>
              {POPULAR_SUGGESTIONS.slice(0, 3).map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setPlace(suggestion)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#f4f7f4] hover:bg-[#dcebe3] text-[#245b50] font-medium transition-colors cursor-pointer"
                >
                  {suggestion.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Region / Country */}
          <div className="md:col-span-1">
            <label htmlFor="region-input" className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
              Region, State, or Country
            </label>
            <input
              id="region-input"
              type="text"
              maxLength={70}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Himachal Pradesh, India"
              className="w-full px-4 py-3 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] focus:ring-2 focus:ring-[#245b50]/15 rounded-xl text-sm font-medium text-[#172b2b] transition-all outline-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 md:col-span-1">
            <div>
              <label htmlFor="date-input" className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#245b50] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] focus:ring-2 focus:ring-[#245b50]/15 rounded-xl text-xs sm:text-sm font-medium text-[#172b2b] outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="enddate-input" className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
                End Date <span className="text-[#667777] font-normal">(Optional)</span>
              </label>
              <input
                id="enddate-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={date}
                className="w-full px-3 py-3 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] focus:ring-2 focus:ring-[#245b50]/15 rounded-xl text-xs sm:text-sm font-medium text-[#172b2b] outline-none"
              />
            </div>
          </div>

          {/* 1-5 Star Rating Selector */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#172b2b] uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Expedition Rating</span>
                <span className="text-[#e88b58]">*</span>
              </label>

              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
                {(hoverRating ?? rating)}.0 / 5.0
              </span>
            </div>

            <div className="p-2.5 sm:p-3 bg-[#fcfdfa] border border-[#d9e0d9] focus-within:border-[#245b50] rounded-xl flex items-center justify-between gap-3">
              {/* Interactive Star Buttons */}
              <div 
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(null)}
                role="radiogroup"
                aria-label="Trip 1 to 5 star rating"
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating ?? rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 sm:p-1.5 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-500 drop-shadow-[0_1px_2px_rgba(245,158,11,0.3)]'
                            : 'fill-transparent text-[#cbd7ce]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating Label */}
              <div className="text-right pl-2 border-l border-[#edf0ec]">
                <span className="text-xs font-black text-[#172b2b] block truncate">
                  {RATING_LEVELS[hoverRating ?? rating]?.label || `${rating} Stars`}
                </span>
                <span className="text-[10px] text-[#667777] font-medium block truncate max-w-[130px] sm:max-w-[180px]">
                  {RATING_LEVELS[hoverRating ?? rating]?.description}
                </span>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
              Expedition Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-[#245b50] text-white shadow-sm shadow-[#245b50]/30'
                      : 'bg-[#f4f7f4] hover:bg-[#e8eee8] text-[#52635d]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Story Narrative */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="story-input" className="text-xs font-bold text-[#172b2b] uppercase tracking-wider">
                Travel Story & Journal Reflections
              </label>
              <span className="text-[11px] text-[#667777]">
                {story.length} / 2500 characters
              </span>
            </div>
            <textarea
              id="story-input"
              rows={4}
              maxLength={2500}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What trail did you take? What was the weather like? What was the most breathtaking view or campfire conversation?"
              className="w-full p-4 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] focus:ring-2 focus:ring-[#245b50]/15 rounded-xl text-sm leading-relaxed text-[#172b2b] transition-all outline-none resize-y min-h-[110px]"
            />
          </div>

          {/* Media Upload Area */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-2">
              Photos & Videos <span className="text-[#667777] font-normal">(Multiple files supported)</span>
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#9db7a8] hover:border-[#245b50] bg-[#f7faf7] hover:bg-[#f2f7f4] rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-[#dcebe3] text-[#245b50] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#172b2b] mb-1">
                Drop your photos and videos here, or <span className="text-[#245b50] underline">browse</span>
              </p>
              <p className="text-xs text-[#667777] max-w-md mx-auto">
                JPG, PNG, WebP, MP4, MOV. Files are safely stored locally in your browser IndexedDB on this device without file size compression limits.
              </p>
            </div>

            {/* Selected File Previews Grid */}
            {selectedPreviews.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-[#52635d] mb-2">
                  <span>
                    {selectedPreviews.length} {selectedPreviews.length === 1 ? 'file' : 'files'} selected (
                    {formatFileSize(selectedPreviews.reduce((acc, curr) => acc + curr.size, 0))})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      selectedPreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                      setSelectedPreviews([]);
                    }}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear all previews
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {selectedPreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-[#d9e0d9] bg-[#e8eee8]"
                    >
                      {preview.type.startsWith('video/') ? (
                        <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                          <video
                            src={preview.previewUrl}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <VideoIcon className="w-6 h-6 text-white drop-shadow" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={preview.previewUrl}
                          alt={preview.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* File type badge */}
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        {preview.type.startsWith('video/') ? 'VIDEO' : 'PHOTO'}
                      </span>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action button row */}
        <div className="mt-8 pt-6 border-t border-[#e2e8df] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !place.trim()}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#245b50] hover:bg-[#1b4332] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-[#245b50]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Saving Expedition...' : 'Save Travel Memory +'}</span>
            </button>

            {statusMessage && (
              <div
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${
                  statusMessage.type === 'error'
                    ? 'text-rose-600'
                    : statusMessage.type === 'saving'
                    ? 'text-[#245b50] animate-pulse'
                    : 'text-[#1b4332]'
                }`}
              >
                {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-[#667777]">
            Saved securely in <strong className="text-[#172b2b]">Trekxplore45</strong> local vault.
          </div>
        </div>
      </form>
    </div>
  );
};
