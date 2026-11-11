import React from 'react';
import { Compass, MapPin, Camera, Calendar, ArrowRight, ShieldCheck, Sparkles, Instagram } from 'lucide-react';

interface HeroProps {
  tripCount: number;
  totalMediaCount: number;
  onScrollToAdd: () => void;
  onScrollToMemories: () => void;
  onLoadSamples?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  tripCount,
  totalMediaCount,
  onScrollToAdd,
  onScrollToMemories,
  onLoadSamples,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#102a25] text-white">
      {/* Background imagery with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(12, 38, 35, 0.92) 0%, rgba(16, 42, 37, 0.78) 50%, rgba(12, 38, 35, 0.45) 100%), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=85')`,
        }}
      />

      {/* Decorative mountain grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#dcebe3_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero text & controls */}
          <div className="lg:col-span-8 max-w-2xl">
            {/* Eyebrow badge with mini emblem & instagram badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d6e8de] text-xs font-semibold tracking-wider uppercase shadow-sm">
                <img
                  src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                  alt="Emblem"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#e88b58]"
                />
                <span>Trekxplore45 · Expedition Journal</span>
              </div>

              <a
                href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 backdrop-blur-md border border-pink-300/30 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Instagram className="w-3.5 h-3.5 text-[#ff80bf]" />
                <span>@trekxplore45</span>
              </a>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white mb-6">
              Collect moments.<br />
              Keep wandering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f1d0b5] to-[#e88b58]">Trekxplore45</span>.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#e7efea] font-normal leading-relaxed mb-8 max-w-xl">
              Your personal travel sanctuary. Save the peaks climbed, hidden trails discovered, and vibrant coastal paths walked. Attach high-resolution photos and video clips, preserving every expedition securely in your browser.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToAdd}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#e88b58] hover:bg-[#d97745] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#e88b58]/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Add a New Memory</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToMemories}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-[#f6f5ef] font-semibold text-sm sm:text-base backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              >
                <span>Explore My Journeys</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                  {tripCount}
                </span>
              </button>

              <a
                href="https://www.instagram.com/trekxplore45?vrfl=MXB2ZWFrNHRtd2gxZQ=="
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f6f5ef] font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all cursor-pointer text-decoration-none"
              >
                <Instagram className="w-4 h-4 text-[#ff80bf]" />
                <span>Instagram Community ↗</span>
              </a>
            </div>

            {/* Quick Stats Banner */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1">
                  {tripCount}
                </span>
                <span className="text-xs text-[#a5c0b4] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#e88b58]" /> Expeditions Logged
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1">
                  {totalMediaCount}
                </span>
                <span className="text-xs text-[#a5c0b4] flex items-center gap-1 mt-0.5">
                  <Camera className="w-3 h-3 text-[#e88b58]" /> Photos & Videos
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#e88b58] flex items-center gap-1">
                  100%
                </span>
                <span className="text-xs text-[#a5c0b4] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#82c5a0]" /> Offline & Private
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Logo Crest (Visible on lg screens) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center">
            <div className="relative group p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
              <div className="w-56 h-56 rounded-full overflow-hidden ring-4 ring-[#e88b58]/50 shadow-2xl bg-neutral-950">
                <img
                  src="/assets/aistudio/IMG-20260707-WA0022.jpg__1__1f4b5ff1.jpeg"
                  alt="TrekXplore Logo Crest"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Motto badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#172b2b] border border-[#e88b58]/60 text-[#f6f5ef] text-[11px] font-bold tracking-wider uppercase shadow-lg">
                Explore More · Trek Beyond
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
