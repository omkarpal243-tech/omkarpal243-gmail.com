import React, { useState, useRef } from 'react';
import { X, Star, Upload, MapPin, Calendar, Compass } from 'lucide-react';
import { TripMemory, TripCategory, MediaFileRecord } from '../types';

interface EditTripModalProps {
  trip: TripMemory | null;
  onClose: () => void;
  onUpdate: (updatedTrip: TripMemory) => Promise<void>;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  trip,
  onClose,
  onUpdate,
}) => {
  if (!trip) return null;

  const [place, setPlace] = useState(trip.place);
  const [region, setRegion] = useState(trip.region || '');
  const [date, setDate] = useState(trip.date);
  const [endDate, setEndDate] = useState(trip.endDate || '');
  const [category, setCategory] = useState<TripCategory>(trip.category || 'trek');
  const [rating, setRating] = useState<number>(trip.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [story, setStory] = useState(trip.story || '');
  const [existingFiles, setExistingFiles] = useState<MediaFileRecord[]>(trip.files || []);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNewFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newRecords: MediaFileRecord[] = Array.from(fileList).map((f) => ({
      name: f.name,
      type: f.type,
      blob: f,
      size: f.size,
    }));
    setExistingFiles((prev) => [...prev, ...newRecords]);
  };

  const removeFileRecord = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) return;

    try {
      setIsSaving(true);
      await onUpdate({
        ...trip,
        place: place.trim(),
        region: region.trim() || undefined,
        date,
        endDate: endDate || undefined,
        category,
        rating,
        story: story.trim(),
        files: existingFiles,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update trip.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8df] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#edf0ec] mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#245b50]" />
            <h3 className="font-extrabold text-xl text-[#172b2b]">
              Edit Travel Memory
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-[#52635d] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Place / Destination
            </label>
            <input
              type="text"
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-sm outline-none focus:border-[#245b50]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Region / Country
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-sm outline-none focus:border-[#245b50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-sm outline-none focus:border-[#245b50]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#172b2b] uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Rating</span>
              </label>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
                {(hoverRating ?? rating)}.0 / 5.0
              </span>
            </div>
            <div 
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[#fcfdfa] border border-[#d9e0d9]"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating ?? rating);
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 hover:scale-120 transition-transform cursor-pointer focus:outline-none"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-500 drop-shadow-2xs'
                          : 'fill-transparent text-neutral-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-bold text-[#52635d] ml-2">
                {(hoverRating ?? rating) === 5
                  ? 'Legendary'
                  : (hoverRating ?? rating) === 4
                  ? 'Great'
                  : (hoverRating ?? rating) === 3
                  ? 'Good'
                  : `${hoverRating ?? rating} Stars`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Travel Story
            </label>
            <textarea
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full p-3.5 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-sm outline-none focus:border-[#245b50]"
            />
          </div>

          {/* Files */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#172b2b] uppercase tracking-wider">
                Attached Media ({existingFiles.length})
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#245b50] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Add More Media
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleAddNewFiles(e.target.files)}
              />
            </div>

            {existingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-[#f4f7f4] rounded-xl">
                {existingFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#d9e0d9] text-xs"
                  >
                    <span className="truncate max-w-[150px] font-medium">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFileRecord(i)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#edf0ec]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#d9e0d9] text-sm font-semibold text-[#52635d] hover:bg-[#f6f5ef] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-[#245b50] hover:bg-[#1b4332] text-white text-sm font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
