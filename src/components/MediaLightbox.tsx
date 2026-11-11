import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Video as VideoIcon } from 'lucide-react';
import { LightboxState } from '../types';

interface MediaLightboxProps {
  state: LightboxState;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  state,
  onClose,
  onNavigate,
}) => {
  const currentItem = state.files[state.currentIndex];
  const hasMultiple = state.files.length > 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMultiple) {
        onNavigate((state.currentIndex - 1 + state.files.length) % state.files.length);
      }
      if (e.key === 'ArrowRight' && hasMultiple) {
        onNavigate((state.currentIndex + 1) % state.files.length);
      }
    },
    [onClose, onNavigate, state.currentIndex, state.files.length, hasMultiple]
  );

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isOpen, handleKeyDown]);

  if (!state.isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10">
        <div className="flex flex-col">
          <h4 className="font-bold text-base sm:text-lg text-white/90 truncate max-w-xs sm:max-w-md">
            {state.tripTitle}
          </h4>
          <span className="text-xs text-[#a5c0b4]">
            {state.currentIndex + 1} of {state.files.length} · {currentItem.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentItem.url && (
            <a
              href={currentItem.url}
              download={currentItem.name || 'trekxplore45-media'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Download file"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Media Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {currentItem.type.startsWith('video/') ? (
          <div className="max-w-4xl max-h-[75vh] w-full flex items-center justify-center">
            <video
              src={currentItem.url}
              controls
              autoPlay
              className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain"
            />
          </div>
        ) : (
          <img
            src={currentItem.url}
            alt={currentItem.caption || currentItem.name}
            className="max-h-[80vh] max-w-full rounded-xl shadow-2xl object-contain transition-transform"
          />
        )}

        {/* Previous Button */}
        {hasMultiple && (
          <button
            onClick={() =>
              onNavigate((state.currentIndex - 1 + state.files.length) % state.files.length)
            }
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform hover:scale-110 cursor-pointer"
            aria-label="Previous media"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {hasMultiple && (
          <button
            onClick={() => onNavigate((state.currentIndex + 1) % state.files.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform hover:scale-110 cursor-pointer"
            aria-label="Next media"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-2xl mx-auto scrollbar-none z-10">
          {state.files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === state.currentIndex
                  ? 'border-[#e88b58] scale-105 shadow-md'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              {file.type.startsWith('video/') ? (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <VideoIcon className="w-4 h-4 text-white" />
                </div>
              ) : (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
