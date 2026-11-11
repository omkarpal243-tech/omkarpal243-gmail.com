import React, { useState } from 'react';
import { Phone, MessageCircle, Copy, Check, ShieldCheck, UserCheck, Sparkles, Mail } from 'lucide-react';

export interface LeaderInfo {
  name: string;
  role: string;
  titleBadge: string;
  phone: string;
  cleanPhone: string;
  avatarColor: string;
  description: string;
}

export const LEADERS: LeaderInfo[] = [
  {
    name: 'Rohit Kanojiya',
    role: 'Owner',
    titleBadge: 'Owner & Founder',
    phone: '8080755443',
    cleanPhone: '8080755443',
    avatarColor: 'from-[#e88b58] to-[#d97745]',
    description: 'Expedition operations, group management, and strategic lead for Trekxplore45 adventures.',
  },
  {
    name: 'Omkar Pal',
    role: 'CEO',
    titleBadge: 'Chief Executive Officer',
    phone: '8591776019',
    cleanPhone: '8591776019',
    avatarColor: 'from-[#245b50] to-[#172b2b]',
    description: 'Expedition planning, digital experience, and trekker community engagement.',
  },
];

export const LeadershipSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPhone = async (phone: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="leadership-team" className="scroll-mt-24">
      <div className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#fdf5ee] via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10">
          {/* Section Eyebrow & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e88b58] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#245b50]" />
                <span>Trekxplore45 Team</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172b2b] tracking-tight">
                Leadership & Expedition Leads
              </h2>
              <p className="text-sm text-[#667777] mt-1 max-w-xl">
                Have questions regarding upcoming treks, custom private group departures, or safety protocols? Connect directly with our core leadership team.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdf5ee] border border-[#e88b58]/30 text-xs font-bold text-[#d97745] self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct WhatsApp & Call Available</span>
            </div>
          </div>

          {/* Leaders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {LEADERS.map((leader, idx) => {
              const isCopied = copiedIndex === idx;
              return (
                <div
                  key={leader.name}
                  className="rounded-2xl border border-[#e2e8df] bg-[#fcfdfa] hover:bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-[#cbd7ce] flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Avatar + Name + Role Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${leader.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}
                        >
                          {leader.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base sm:text-lg text-[#172b2b]">
                              {leader.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f4f7f4] border border-[#d9e0d9] text-[#245b50]">
                              {leader.role}
                            </span>
                            <span className="text-[11px] text-[#667777] font-medium hidden sm:inline">
                              Trekxplore45
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#fdf5ee] text-[#d97745] border border-[#e88b58]/20 shrink-0">
                        {leader.titleBadge}
                      </span>
                    </div>

                    <p className="text-xs text-[#52635d] leading-relaxed mb-5">
                      {leader.description}
                    </p>
                  </div>

                  {/* Contact Action Bar */}
                  <div className="pt-4 border-t border-[#edf0ec] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#245b50]" />
                      <a
                        href={`tel:${leader.cleanPhone}`}
                        className="text-sm font-black text-[#172b2b] hover:text-[#e88b58] transition-colors"
                      >
                        +91 {leader.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(leader.phone, idx)}
                        className="p-2 rounded-xl border border-[#d9e0d9] hover:bg-neutral-100 text-[#667777] hover:text-[#172b2b] transition-colors cursor-pointer"
                        title="Copy phone number"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={`tel:${leader.cleanPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d9e0d9] hover:bg-[#f6f5ef] text-xs font-bold text-[#172b2b] transition-colors text-decoration-none"
                      >
                        <Phone className="w-3 h-3 text-[#245b50]" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/91${leader.cleanPhone}?text=Hi%20${encodeURIComponent(
                          leader.name
                        )}!%20I%20am%20reaching%20out%20via%20Trekxplore45%20regarding%20an%20expedition.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors text-decoration-none"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
