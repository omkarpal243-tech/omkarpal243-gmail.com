import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Compass, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Sparkles,
  Mountain,
  Waves,
  Car,
  Tent,
  Landmark,
  Building2,
  TreePine,
  Image as ImageIcon
} from 'lucide-react';
import { UpcomingTrip, TripCategory, ChecklistItem } from '../types';

interface UpcomingTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Omit<UpcomingTrip, 'id'>) => Promise<void>;
  tripToEdit?: UpcomingTrip | null;
  onUpdate?: (trip: UpcomingTrip) => Promise<void>;
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

const COVER_PRESETS = [
  {
    name: 'Kalsubai Poster',
    url: '/assets/aistudio/1793759244157_2__1__8444317f.jpeg',
  },
  {
    name: 'Himalayas',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Iceland Glaciers',
    url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Swiss Alps',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Patagonia Peaks',
    url: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Forest Trail',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
];

const PACKING_PRESETS = [
  'Headlamp & extra batteries (Mandatory)',
  'Trekking shoes with rubber grip',
  'Waterproof shell & rain cover',
  'First aid & blister tape',
  '2-3 Litres water bottle',
  'Warm windproof jacket / fleece',
  'Energy bars & dry fruits',
  'Permits & ID documents',
];

export const UpcomingTripModal: React.FC<UpcomingTripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tripToEdit,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const [destination, setDestination] = useState(tripToEdit?.destination || '');
  const [subtitle, setSubtitle] = useState(tripToEdit?.subtitle || '');
  const [region, setRegion] = useState(tripToEdit?.region || '');
  const [price, setPrice] = useState(tripToEdit?.price || '');
  const [registrationLink, setRegistrationLink] = useState(
    tripToEdit?.registrationLink || ''
  );
  const [startDate, setStartDate] = useState(
    tripToEdit?.startDate ||
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(tripToEdit?.endDate || '');
  const [category, setCategory] = useState<TripCategory>(tripToEdit?.category || 'trek');
  const [status, setStatus] = useState<'planning' | 'booked' | 'ready'>(
    tripToEdit?.status || 'booked'
  );
  const [coverUrl, setCoverUrl] = useState(
    tripToEdit?.coverUrl || COVER_PRESETS[0].url
  );
  const [notes, setNotes] = useState(tripToEdit?.notes || '');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    tripToEdit?.checklist || [
      { id: '1', text: 'Headlamp & extra batteries', completed: true },
      { id: '2', text: 'Trekking shoes with solid grip', completed: true },
      { id: '3', text: 'Warm fleece jacket for summit', completed: false },
    ]
  );
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        text: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleAddPresetItem = (text: string) => {
    if (checklist.some((c) => c.text.toLowerCase() === text.toLowerCase())) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        text,
        completed: false,
      },
    ]);
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !startDate) return;

    try {
      setIsSubmitting(true);
      const tripData = {
        destination: destination.trim(),
        subtitle: subtitle.trim() || undefined,
        region: region.trim() || undefined,
        price: price.trim() || undefined,
        registrationLink: registrationLink.trim() || undefined,
        startDate,
        endDate: endDate || undefined,
        category,
        status,
        coverUrl,
        posterUrl: coverUrl.includes('8444317f') ? coverUrl : undefined,
        notes: notes.trim() || undefined,
        contacts: tripToEdit?.contacts || ['8080755443', '8591776019'],
        checklist,
        created: tripToEdit?.created || Date.now(),
      };

      if (tripToEdit && onUpdate) {
        await onUpdate({
          ...tripData,
          id: tripToEdit.id,
        });
      } else {
        await onSave(tripData);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save upcoming trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8df] my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#edf0ec] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fdf5ee] flex items-center justify-center text-[#e88b58]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-[#172b2b]">
                {tripToEdit ? 'Edit Upcoming Expedition' : 'Plan an Upcoming Expedition'}
              </h3>
              <p className="text-xs text-[#667777]">
                Countdown, packing gear checklist, and itinerary notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-[#52635d] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Target Destination or Trail <span className="text-[#e88b58]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#245b50] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kalsubai Night Trek"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          {/* Subtitle & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Tagline or Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Mount Everest of Maharashtra"
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Package Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. ₹999 per person"
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          {/* Registration / Google Form Link */}
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Registration Form Link (Generates QR Code Automatically)
            </label>
            <input
              type="url"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="e.g. https://forms.gle/du6wjKqJaRkNWhcK8"
              className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
            />
          </div>

          {/* Region & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Region or Country
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Himalayas, Nepal"
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Expedition Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none cursor-pointer"
              >
                <option value="planning">🟡 Planning & Researching</option>
                <option value="booked">🟢 Booked & Permits Ready</option>
                <option value="ready">🔵 Packed & Departure Ready</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Departure Date <span className="text-[#e88b58]">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#245b50] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
                Return Date <span className="text-[#667777] font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfdfa] border border-[#d9e0d9] focus:border-[#245b50] rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Expedition Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-[#245b50] text-white shadow-xs'
                      : 'bg-[#f4f7f4] text-[#52635d] hover:bg-[#e8eee8]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cover Landscape */}
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Cover Landscape Image
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {COVER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverUrl(preset.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    coverUrl === preset.url
                      ? 'border-[#e88b58] ring-2 ring-[#e88b58]/40 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-medium text-center py-0.5 truncate px-1">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Or paste an image URL..."
              className="w-full px-3 py-2 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-xs outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#172b2b] uppercase tracking-wider mb-1.5">
              Trip Notes & Route Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Trail permits required, guide contact, flight details, or route highlights..."
              className="w-full p-3 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-sm outline-none focus:border-[#245b50]"
            />
          </div>

          {/* Packing Gear Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#172b2b] uppercase tracking-wider">
                Gear & Packing Checklist ({checklist.length})
              </label>
              <span className="text-[11px] text-[#245b50] font-semibold">
                {checklist.filter((c) => c.completed).length} of {checklist.length} packed
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span className="text-[11px] text-[#667777] self-center">Add gear:</span>
              {PACKING_PRESETS.slice(0, 5).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddPresetItem(preset)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#f4f7f4] hover:bg-[#dcebe3] text-[#245b50] font-medium cursor-pointer transition-colors"
                >
                  + {preset.split('&')[0]}
                </button>
              ))}
            </div>

            {/* Add input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add gear (e.g. Crampons, Down sleeping bag, GPS)..."
                className="flex-1 px-3 py-2 bg-[#fcfdfa] border border-[#d9e0d9] rounded-xl text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3.5 py-2 rounded-xl bg-[#245b50] text-white text-xs font-bold hover:bg-[#1b4332] cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Checklist items list */}
            {checklist.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-[#f9faf8] rounded-xl border border-[#edf0ec]">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-white text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {
                          setChecklist((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, completed: !c.completed } : c
                            )
                          );
                        }}
                        className="rounded border-[#cbd7ce] text-[#245b50] focus:ring-[#245b50]"
                      />
                      <span className={item.completed ? 'line-through text-[#8fa799]' : 'text-[#172b2b]'}>
                        {item.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
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
              disabled={isSubmitting || !destination.trim()}
              className="px-6 py-2.5 rounded-full bg-[#e88b58] hover:bg-[#d97745] text-white text-sm font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : tripToEdit ? 'Save Changes' : 'Schedule Expedition +'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
