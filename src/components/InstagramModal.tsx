import React, { useState } from 'react';
import { Instagram, X, ExternalLink, Copy, Check, Sparkles, Share2 } from 'lucide-react';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const INSTAGRAM_LINK = 'https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ==';
export const INSTAGRAM_HANDLE = '@trekxplore45';
export const INSTAGRAM_QR_IMAGE = '/assets/aistudio/WhatsApp_Image_2026-11-11_at_08.28.02_e20c1da8.jpeg';

export const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(INSTAGRAM_LINK);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleCopyHandle = async () => {
    try {
      await navigator.clipboard.writeText(INSTAGRAM_HANDLE);
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden max-w-sm sm:max-w-md w-full shadow-2xl border border-neutral-200 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header styling with Instagram gradient accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" />

        <div className="p-6 sm:p-7">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] p-[2px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-[#e1306c]" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#172b2b] leading-tight">
                  Trekxplore45 on Instagram
                </h3>
                <span className="text-xs text-[#667777] font-semibold flex items-center gap-1">
                  Official Travel Community
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Official Nametag / QR Code Container */}
          <div className="relative group mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-neutral-100 shadow-md bg-neutral-900 max-w-[280px]">
            <img
              src={INSTAGRAM_QR_IMAGE}
              alt="Trekxplore45 Instagram QR Code Nametag"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute bottom-2 inset-x-2 py-1 px-2.5 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium text-white flex items-center justify-center gap-1.5">
              <span>Scan with Instagram Camera</span>
            </div>
          </div>

          {/* Handle Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-pink-200/80 mb-3">
            <span className="font-black text-sm text-[#bc1888]">
              {INSTAGRAM_HANDLE}
            </span>
            <button
              onClick={handleCopyHandle}
              className="text-neutral-500 hover:text-[#bc1888] transition-colors cursor-pointer p-0.5"
              title="Copy username"
            >
              {copiedHandle ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <p className="text-xs text-[#667777] leading-relaxed mb-6 max-w-xs mx-auto">
            Scan using Instagram’s camera or Google Lens to explore our reels, stories, trek updates, and community photo drops!
          </p>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#e1306c]/25 transition-all transform hover:-translate-y-0.5 text-decoration-none"
            >
              <Instagram className="w-4 h-4" />
              <span>Visit @trekxplore45 Profile ↗</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy Instagram Profile Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
