import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Luggage,
  ListTodo,
  Phone,
  MessageCircle,
  Bus,
  Coffee,
  UserCheck,
  HeartPulse,
  Maximize2,
  Users,
  QrCode,
  ExternalLink,
  FileText,
  Copy,
  Check,
  X,
  Instagram
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UpcomingTrip } from '../types';

interface UpcomingTripsSectionProps {
  trips: UpcomingTrip[];
  onOpenCreateModal: () => void;
  onEditTrip: (trip: UpcomingTrip) => void;
  onDeleteTrip: (id: number) => void;
  onToggleChecklistItem: (tripId: number, itemId: string) => void;
  onConvertToMemory: (trip: UpcomingTrip) => void;
  onLoadSamples: () => void;
  onViewPoster?: (posterUrl: string, title: string) => void;
}

export const UpcomingTripsSection: React.FC<UpcomingTripsSectionProps> = ({
  trips,
  onOpenCreateModal,
  onEditTrip,
  onDeleteTrip,
  onToggleChecklistItem,
  onConvertToMemory,
  onLoadSamples,
}) => {
  const [expandedChecklists, setExpandedChecklists] = useState<Record<number, boolean>>({});
  const [expandedItineraries, setExpandedItineraries] = useState<Record<number, boolean>>({});
  const [selectedPoster, setSelectedPoster] = useState<{ url: string; title: string } | null>(null);
  const [selectedQR, setSelectedQR] = useState<{ url: string; title: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleChecklist = (id: number) => {
    setExpandedChecklists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleItinerary = (id: number) => {
    setExpandedItineraries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getDaysUntil = (dateStr: string) => {
    try {
      const target = new Date(dateStr + 'T00:00:00').getTime();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = target - today.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return null;
    }
  };

  const formatCountdown = (dateStr: string) => {
    const days = getDaysUntil(dateStr);
    if (days === null) return 'Date set';
    if (days < 0) return 'In progress / Completed';
    if (days === 0) return 'Departing Today! 🚀';
    if (days === 1) return 'Departing Tomorrow! ⏳';
    return `${days} Days to Go`;
  };

  const formatDateRange = (start: string, end?: string) => {
    try {
      const d1 = new Date(start + 'T12:00:00');
      const startFormatted = d1.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (!end) return startFormatted;
      const d2 = new Date(end + 'T12:00:00');
      const endFormatted = d2.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return `${startFormatted} – ${endFormatted}`;
    } catch {
      return start;
    }
  };

  return (
    <section id="upcoming-trips" className="scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e88b58]">
            <Compass className="w-3.5 h-3.5" />
            <span>Trekxplore45 Expeditions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172b2b] tracking-tight mt-1">
            Upcoming Trips & Treks
          </h2>
          <p className="text-sm text-[#667777] mt-1">
            Official expeditions, Google Form booking, QR code registration, gear checklists, and live countdowns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <a
            href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 hover:from-purple-100 hover:to-pink-100 border border-pink-200 text-[#b5179e] text-xs font-bold transition-all shadow-xs"
            title="Follow Trekxplore45 on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
            <span>@trekxplore45</span>
          </a>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#e88b58] hover:bg-[#d97745] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#e88b58]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Plan New Expedition</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#d9e0d9] p-10 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fdf5ee] text-[#e88b58] flex items-center justify-center mx-auto mb-4">
            <Luggage className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-[#172b2b] mb-2">
            No upcoming expeditions scheduled yet
          </h3>
          <p className="text-sm text-[#667777] max-w-md mx-auto mb-6">
            Where to next? Plan your upcoming trail, mountain summit, or road trip. Keep gear lists and routes organized before you leave.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#e88b58] hover:bg-[#d97745] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plan an Expedition</span>
            </button>
            <button
              onClick={onLoadSamples}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f4f7f4] hover:bg-[#e8eee8] text-[#245b50] font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Expeditions</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {trips.map((trip) => {
            const packedCount = trip.checklist.filter((c) => c.completed).length;
            const totalCount = trip.checklist.length;
            const percentPacked = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
            const daysLeft = getDaysUntil(trip.startDate);
            const isSoon = daysLeft !== null && daysLeft <= 20 && daysLeft >= 0;

            const isChecklistOpen = !!expandedChecklists[trip.id || 0];
            const isItineraryOpen = !!expandedItineraries[trip.id || 0];
            const regLink = trip.registrationLink?.includes('AqJ768NVfDd2Mw9y8')
              ? 'https://forms.gle/du6wjKqJaRkNWhcK8'
              : (trip.registrationLink || (trip.destination.toLowerCase().includes('kalsubai') ? 'https://forms.gle/du6wjKqJaRkNWhcK8' : ''));

            return (
              <article
                key={trip.id || trip.created}
                className="group bg-white rounded-3xl border border-[#e2e8df] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Header / Poster Banner */}
                  <div className="relative bg-neutral-950 overflow-hidden">
                    <div 
                      className="relative h-60 sm:h-72 overflow-hidden cursor-pointer" 
                      onClick={() => setSelectedPoster({ url: trip.posterUrl || trip.coverUrl || '', title: trip.destination })}
                      title="Click to view full poster"
                    >
                      <img
                        src={
                          trip.coverUrl ||
                          trip.posterUrl ||
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt={trip.destination}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm ${
                              trip.status === 'booked'
                                ? 'bg-emerald-600/90 text-white'
                                : trip.status === 'ready'
                                ? 'bg-blue-600/90 text-white'
                                : 'bg-amber-500/90 text-white'
                            }`}
                          >
                            {trip.status === 'booked'
                              ? '✓ Official Event'
                              : trip.status === 'ready'
                              ? '★ Ready'
                              : '⚡ Upcoming'}
                          </span>

                          {trip.price && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#e88b58] text-white backdrop-blur-md shadow-md">
                              {trip.price}
                            </span>
                          )}
                        </div>

                        {/* Countdown badge */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md shadow-sm ${
                            isSoon
                              ? 'bg-[#172b2b] text-[#f6f5ef] border border-[#e88b58]'
                              : 'bg-black/60 text-white'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-[#e88b58]" />
                          <span>{formatCountdown(trip.startDate)}</span>
                        </span>
                      </div>

                      {/* Poster view expand hint */}
                      <div className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Title overlay */}
                      <div className="absolute bottom-3 inset-x-4 text-white">
                        <div className="flex items-center gap-2 text-xs text-[#d6e8de] font-semibold mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#e88b58] shrink-0" />
                          <span className="truncate">{trip.region || 'Maharashtra'}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-sm text-white">
                          {trip.destination}
                        </h3>
                        {trip.subtitle && (
                          <div className="text-xs text-[#f1d0b5] font-semibold mt-0.5 tracking-wide">
                            {trip.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Date and Price Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#172b2b] font-bold">
                        <Calendar className="w-4 h-4 text-[#e88b58]" />
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#667777] bg-[#f4f7f4] px-2.5 py-1 rounded-full">
                          <Users className="w-3 h-3 text-[#245b50]" /> Limited Batch Size
                        </span>
                      </div>
                    </div>

                    {/* REGISTRATION FORM & QR CODE SECTION */}
                    {regLink && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fffdfa] via-white to-[#fdf8f4] border-2 border-[#e88b58]/40 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                        {/* QR Code preview box */}
                        <div 
                          onClick={() => setSelectedQR({ url: regLink, title: trip.destination })}
                          className="group/qr relative p-2.5 bg-white rounded-xl border border-[#d9e0d9] hover:border-[#e88b58] shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 text-center bg-white"
                          title="Click to enlarge QR Code"
                        >
                          <QRCodeSVG 
                            value={regLink}
                            size={100}
                            level="H"
                            className="rounded-md"
                          />
                          <span className="block text-[10px] font-bold text-[#667777] group-hover/qr:text-[#e88b58] mt-1.5 flex items-center justify-center gap-1">
                            <QrCode className="w-3 h-3 text-[#245b50]" />
                            <span>Scan / Zoom</span>
                          </span>
                        </div>

                        {/* Registration Details & Call to Action */}
                        <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf5ee] text-[#d97745] text-[10px] font-black uppercase tracking-wider mb-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Official Registration</span>
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-[#172b2b]">
                              Book Slot via Google Form
                            </h4>
                            <p className="text-xs text-[#667777] mt-0.5 line-clamp-2">
                              Scan the QR code or click below to fill your trek registration form and lock your seat.
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                            <a
                              href={regLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e88b58] hover:bg-[#d97745] text-white text-xs font-bold shadow-md shadow-[#e88b58]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-decoration-none"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Open Google Form ↗</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => setSelectedQR({ url: regLink, title: trip.destination })}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-[#d9e0d9] hover:bg-[#f6f5ef] text-[#52635d] text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5 text-[#245b50]" />
                              <span>View QR</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inclusions Strip (from poster: Transport, Breakfast, Leader, Medic) */}
                    {trip.inclusions && trip.inclusions.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#667777] mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#e88b58]" />
                          <span>Expedition Inclusions</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {trip.inclusions.map((inc, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 rounded-xl bg-[#f7faf7] border border-[#e2e8df] text-xs font-semibold text-[#172b2b]"
                            >
                              {inc.toLowerCase().includes('transport') ? (
                                <Bus className="w-4 h-4 text-[#245b50] shrink-0" />
                              ) : inc.toLowerCase().includes('breakfast') || inc.toLowerCase().includes('tea') ? (
                                <Coffee className="w-4 h-4 text-[#e88b58] shrink-0" />
                              ) : inc.toLowerCase().includes('leader') || inc.toLowerCase().includes('guide') ? (
                                <UserCheck className="w-4 h-4 text-[#245b50] shrink-0" />
                              ) : (
                                <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                              <span className="text-[11px] leading-tight truncate">{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes preview */}
                    {trip.notes && (
                      <p className="text-xs text-[#52635d] leading-relaxed line-clamp-3">
                        {trip.notes}
                      </p>
                    )}

                    {/* Leadership Contact & Booking inquiry strip */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#fdf5ee] border border-[#e88b58]/30 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#e88b58] text-white flex items-center justify-center shrink-0">
                            <Phone className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#d97745]">
                            Expedition Leads & Inquiries
                          </span>
                        </div>

                        <a
                          href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#b5179e] hover:text-[#e1306c] transition-colors"
                          title="Follow @trekxplore45 on Instagram"
                        >
                          <Instagram className="w-3 h-3 text-[#e1306c]" />
                          <span>@trekxplore45</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Rohit Kanojiya - Owner */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#e88b58]/20 shadow-xs flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-[#172b2b]">
                                Rohit Kanojiya
                              </span>
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-[#fdf5ee] text-[#d97745] border border-[#e88b58]/20">
                                Owner
                              </span>
                            </div>
                            <a
                              href="tel:8080755443"
                              className="text-[11px] font-bold text-[#52635d] hover:text-[#e88b58] transition-colors mt-0.5 block"
                            >
                              +91 8080755443
                            </a>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href="tel:8080755443"
                              className="p-1.5 rounded-lg bg-[#f6f5ef] hover:bg-[#ece9df] text-[#172b2b] transition-colors"
                              title="Call Rohit Kanojiya (Owner)"
                            >
                              <Phone className="w-3 h-3 text-[#245b50]" />
                            </a>
                            <a
                              href={`https://wa.me/918080755443?text=Hi%20Rohit!%20I%20am%20interested%20in%20joining%20the%20${encodeURIComponent(
                                trip.destination
                              )}%20trek.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              title="WhatsApp Rohit Kanojiya (Owner)"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Omkar Pal - CEO */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#e88b58]/20 shadow-xs flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-[#172b2b]">
                                Omkar Pal
                              </span>
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-[#dcebe3] text-[#245b50] border border-[#245b50]/20">
                                CEO
                              </span>
                            </div>
                            <a
                              href="tel:8591776019"
                              className="text-[11px] font-bold text-[#52635d] hover:text-[#245b50] transition-colors mt-0.5 block"
                            >
                              +91 8591776019
                            </a>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href="tel:8591776019"
                              className="p-1.5 rounded-lg bg-[#f6f5ef] hover:bg-[#ece9df] text-[#172b2b] transition-colors"
                              title="Call Omkar Pal (CEO)"
                            >
                              <Phone className="w-3 h-3 text-[#245b50]" />
                            </a>
                            <a
                              href={`https://wa.me/918591776019?text=Hi%20Omkar!%20I%20am%20interested%20in%20joining%20the%20${encodeURIComponent(
                                trip.destination
                              )}%20trek.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              title="WhatsApp Omkar Pal (CEO)"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Packing Checklist Progress */}
                    {totalCount > 0 && (
                      <div className="bg-[#f9faf8] rounded-2xl p-3.5 border border-[#edf0ec]">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#172b2b] flex items-center gap-1.5">
                            <ListTodo className="w-4 h-4 text-[#245b50]" />
                            <span>Gear & Packing Checklist</span>
                          </span>
                          <span className="font-extrabold text-[#245b50]">
                            {packedCount}/{totalCount} ({percentPacked}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#e2e8df] overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full bg-[#245b50] transition-all duration-300"
                            style={{ width: `${percentPacked}%` }}
                          />
                        </div>

                        {/* Toggle checklist items button */}
                        <button
                          type="button"
                          onClick={() => trip.id && toggleChecklist(trip.id)}
                          className="w-full text-left text-[11px] font-bold text-[#245b50] hover:text-[#1b4332] flex items-center justify-between pt-1 cursor-pointer"
                        >
                          <span>{isChecklistOpen ? 'Hide packing list' : 'View & check off gear'}</span>
                          {isChecklistOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Expandable checklist list */}
                        {isChecklistOpen && (
                          <div className="mt-3 pt-3 border-t border-[#edf0ec] space-y-1.5 max-h-48 overflow-y-auto">
                            {trip.checklist.map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center gap-2 p-1 rounded-md hover:bg-white text-xs cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={() =>
                                    trip.id && onToggleChecklistItem(trip.id, item.id)
                                  }
                                  className="rounded border-[#cbd7ce] text-[#245b50] focus:ring-[#245b50]"
                                />
                                <span
                                  className={
                                    item.completed
                                      ? 'line-through text-[#8fa799]'
                                      : 'text-[#172b2b] font-medium'
                                  }
                                >
                                  {item.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Itinerary highlights preview (if present) */}
                    {trip.itinerary && trip.itinerary.length > 0 && (
                      <div className="text-xs">
                        <button
                          type="button"
                          onClick={() => trip.id && toggleItinerary(trip.id)}
                          className="flex items-center justify-between w-full text-[#52635d] hover:text-[#172b2b] font-bold py-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#e88b58]" />
                            <span>Trek Timeline ({trip.itinerary.length} stages)</span>
                          </span>
                          {isItineraryOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isItineraryOpen && (
                          <ul className="mt-2 pl-4 border-l-2 border-[#dcebe3] space-y-1.5 text-[11px] text-[#52635d]">
                            {trip.itinerary.map((stop, sIdx) => (
                              <li key={sIdx}>{stop}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 sm:px-6 py-3.5 bg-[#fcfdfa] border-t border-[#edf0ec] flex items-center justify-between gap-3">
                  {/* Promote / Move to Memories button */}
                  <button
                    type="button"
                    onClick={() => onConvertToMemory(trip)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245b50] hover:text-[#1b4332] py-1 px-3 rounded-full bg-[#dcebe3]/70 hover:bg-[#dcebe3] transition-colors cursor-pointer"
                    title="Promote this completed trip to your Memory Journal"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed! Log Memory</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTrip(trip)}
                      className="p-1.5 rounded-lg text-[#52635d] hover:bg-[#e8eee8] transition-colors cursor-pointer"
                      title="Edit trip"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete upcoming expedition "${trip.destination}"?`)) {
                          if (trip.id) onDeleteTrip(trip.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#52635d] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete upcoming trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* QR Code Enlarged Modal */}
      {selectedQR && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedQR(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-[#e2e8df]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#e88b58]">
                  <img
                    src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#172b2b]">
                    Trekxplore45
                  </h4>
                  <span className="text-[10px] text-[#667777] font-semibold">
                    Registration QR Code
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQR(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#d9e0d9] inline-block shadow-inner mb-4">
              <QRCodeSVG
                value={selectedQR.url}
                size={220}
                level="H"
                includeMargin={true}
                className="rounded-xl mx-auto"
              />
            </div>

            <h5 className="font-black text-lg text-[#172b2b] mb-1">
              {selectedQR.title}
            </h5>
            <p className="text-xs text-[#667777] mb-4">
              Scan with camera or Google Lens to open the Google Form registration.
            </p>

            <div className="space-y-2">
              <a
                href={selectedQR.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#e88b58] hover:bg-[#d97745] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-decoration-none"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google Form ↗</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(selectedQR.url)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#d9e0d9] hover:bg-[#f4f7f4] text-[#172b2b] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#667777]" />
                    <span>Copy Form Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster Zoom Modal */}
      {selectedPoster && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPoster(null)}
        >
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#e88b58] font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              Close ✕
            </button>
            <img
              src={selectedPoster.url}
              alt={selectedPoster.title}
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};
