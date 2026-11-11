import React, { useState } from 'react';
import { Instagram, Sparkles, ExternalLink, QrCode, Copy, Check, Heart, Camera, Compass } from 'lucide-react';
import { INSTAGRAM_LINK, INSTAGRAM_HANDLE, INSTAGRAM_QR_IMAGE } from './InstagramModal';

interface InstagramSectionProps {
  onOpenQRModal: () => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ onOpenQRModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(INSTAGRAM_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="instagram-community" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121f1d] via-[#1a3832] to-[#122b27] border border-[#2f534a] shadow-xl text-white p-6 sm:p-8 lg:p-10">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#e1306c]/20 via-[#fd1d1d]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#245b50]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Info Column */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f5d0b3] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#fd1d1d] animate-pulse" />
              <Instagram className="w-3.5 h-3.5 text-[#e88b58]" />
              <span>Official Instagram Community</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Connect with us on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcb045] via-[#fd1d1d] to-[#833ab4]">
                  Instagram
                </span>
              </h3>
              <p className="text-sm sm:text-base text-[#cfded5] mt-2 max-w-xl leading-relaxed">
                Follow <strong className="text-white font-semibold">{INSTAGRAM_HANDLE}</strong> for breathtaking summit sunrises, behind-the-scenes trail updates, gear breakdowns, and live expedition announcements. Tag us to be featured in our community journal!
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-pink-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Reels & Stories</h4>
                  <p className="text-[11px] text-[#a9c2b5]">Daily Sahyadri & Himalayan trail drops</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Exclusive Slot Drops</h4>
                  <p className="text-[11px] text-[#a9c2b5]">First alerts for upcoming trek registrations</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Trekker Feature</h4>
                  <p className="text-[11px] text-[#a9c2b5]">Tag #Trekxplore45 to get reposted</p>
                </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#fd1d1d]/25 transition-all transform hover:-translate-y-0.5 text-decoration-none"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow {INSTAGRAM_HANDLE} ↗</span>
              </a>

              <button
                type="button"
                onClick={onOpenQRModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#f6f5ef] border border-white/20 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#e88b58]" />
                <span>Scan Nametag QR</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-full bg-transparent hover:bg-white/10 text-[#a9c2b5] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                title="Copy profile URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Nametag QR Card Preview */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div 
              onClick={onOpenQRModal}
              className="group/card relative cursor-pointer max-w-[240px] sm:max-w-[260px] w-full rounded-2xl p-2 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] shadow-2xl hover:scale-103 transition-transform duration-300"
              title="Click to expand Instagram Nametag QR"
            >
              <div className="bg-neutral-950 rounded-xl overflow-hidden relative">
                <img
                  src={INSTAGRAM_QR_IMAGE}
                  alt="Trekxplore45 Instagram Nametag QR"
                  className="w-full h-auto object-cover group-hover/card:brightness-105 transition-all"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-white text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                    <QrCode className="w-3.5 h-3.5 text-[#e1306c]" />
                    <span>Click to Zoom QR</span>
                  </span>
                </div>
              </div>

              <div className="py-2 px-1 text-center">
                <span className="text-white text-xs font-black tracking-wide flex items-center justify-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                  <span>@TREKXPLORE45</span>
                </span>
                <span className="text-[10px] text-white/80 font-medium block">
                  Scan with camera to follow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
