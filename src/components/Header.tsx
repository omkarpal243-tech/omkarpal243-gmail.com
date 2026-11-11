import React, { useState } from 'react';
import { Compass, Mountain, Plus, Download, Sparkles, Trash2, BarChart3, Menu, X, Instagram } from 'lucide-react';

interface HeaderProps {
  tripCount: number;
  upcomingCount?: number;
  onOpenAddModal: () => void;
  onLoadSamples: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onOpenStats: () => void;
  onOpenInstagramQR?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tripCount,
  upcomingCount = 0,
  onOpenAddModal,
  onLoadSamples,
  onClearAll,
  onExport,
  onOpenStats,
  onOpenInstagramQR,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8df] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group text-decoration-none">
          <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#e88b58]/50 shadow-md group-hover:scale-105 group-hover:ring-[#e88b58] transition-all shrink-0 bg-neutral-900">
            <img
              src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
              alt="Trekxplore45 Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline tracking-tight">
              <span className="font-extrabold text-xl sm:text-2xl text-[#172b2b] tracking-tight">
                Trekxplore
              </span>
              <span className="font-black text-xl sm:text-2xl text-[#e88b58] ml-0.5">
                45
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#e88b58] ml-1"></span>
            </div>
            <span className="text-[10px] tracking-wider font-semibold uppercase text-[#667777] -mt-0.5 hidden sm:block">
              Explore More. Trek Beyond.
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-[#52635d]">
          <a
            href="#upcoming-trips"
            className="hover:text-[#172b2b] transition-colors flex items-center gap-1.5"
          >
            <span>Upcoming</span>
            {upcomingCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#fdf5ee] text-[#e88b58] font-bold">
                {upcomingCount}
              </span>
            )}
          </a>
          <a
            href="#my-trips"
            className="hover:text-[#172b2b] transition-colors flex items-center gap-1.5"
          >
            <span>My Memories</span>
            {tripCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#dcebe3] text-[#245b50] font-bold">
                {tripCount}
              </span>
            )}
          </a>
          <a
            href="#leadership-team"
            className="hover:text-[#172b2b] transition-colors flex items-center gap-1.5"
          >
            <span>Team & Leads</span>
          </a>
          <a
            href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-90 transition-all flex items-center gap-1.5 text-xs py-1 px-3 rounded-full bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-pink-200/90 text-[#b5179e] font-bold hover:shadow-xs"
            title="Visit @trekxplore45 on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
            <span>@trekxplore45</span>
          </a>
          <button
            onClick={onOpenStats}
            className="hover:text-[#172b2b] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#245b50]" />
            <span>Journal Stats</span>
          </button>
          <button
            onClick={onExport}
            className="hover:text-[#172b2b] transition-colors flex items-center gap-1.5 cursor-pointer text-xs py-1 px-2.5 rounded-lg border border-[#d9e0d9] hover:bg-[#f6f5ef]"
            title="Export journal backup"
          >
            <Download className="w-3.5 h-3.5 text-[#667777]" />
            <span>Backup</span>
          </button>
          {tripCount === 0 && (
            <button
              onClick={onLoadSamples}
              className="hover:text-[#e88b58] transition-colors flex items-center gap-1.5 text-xs text-[#e88b58] font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Treks</span>
            </button>
          )}
        </nav>

        {/* Header Right Action */}
        <div className="flex items-center gap-3">
          <a
            href="#add-trip"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#245b50] hover:bg-[#1b4332] text-white text-sm font-bold shadow-md shadow-[#245b50]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-decoration-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Travel Memory</span>
            <span className="sm:hidden">Add</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#52635d] hover:bg-[#f6f5ef]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white border-b border-[#e2e8df] space-y-3">
          <a
            href="#upcoming-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#172b2b]"
          >
            Upcoming Trips ({upcomingCount})
          </a>
          <a
            href="#my-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#172b2b]"
          >
            My Memories ({tripCount})
          </a>
          <a
            href="#leadership-team"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#172b2b]"
          >
            Leadership Team & Contacts
          </a>
          <a
            href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-bold text-[#b5179e] flex items-center gap-2"
          >
            <Instagram className="w-5 h-5 text-[#e1306c]" />
            <span>Follow @trekxplore45</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStats();
            }}
            className="w-full text-left py-2 text-base font-medium text-[#172b2b] flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-[#245b50]" />
            Journal Stats & Milestones
          </button>
          <div className="pt-2 border-t border-[#e2e8df] flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onExport();
              }}
              className="flex-1 py-2 px-3 rounded-lg border border-[#d9e0d9] text-xs font-semibold text-[#52635d] flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Backup Journal
            </button>
            {tripCount === 0 ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoadSamples();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#fdf5ee] text-[#d97745] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Load Sample Treks
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onClearAll();
                }}
                className="py-2 px-3 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
