'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy, Medal } from 'lucide-react';
import { achievementService, Achievement } from '@/services/achievement.service';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => currentYear - i);

const placementIcon = (placement: string) => {
  const p = placement.toLowerCase();
  if (p.includes('gold') || p.includes('1st') || p.includes('first'))
    return <Trophy className="w-7 h-7 text-yellow-500" />;
  return <Medal className="w-7 h-7 text-slate-400" />;
};

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState<number | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    achievementService.getAll().then(setAchievements).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = yearFilter === 'ALL'
    ? achievements
    : achievements.filter(a => a.year === yearFilter);

  const totalAwards = achievements.length;
  const goldMedals = achievements.filter(a => a.placement.toLowerCase().includes('gold') || a.placement.toLowerCase().includes('1st') || a.placement.toLowerCase().includes('first')).length;
  const nationalTitles = achievements.filter(a => a.title.toLowerCase().includes('national')).length;
  const international = achievements.filter(a => a.title.toLowerCase().includes('international')).length;

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      {/* Page Banner */}
      <section className="bg-[#f4f6fb] py-12 md:py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-rahula-blue mb-4 leading-tight">
          Our Achievements
        </h1>
        <p className="text-slate-500 text-base md:text-lg">Excellence in traditional Sri Lankan dance</p>
      </section>

      <section className="pb-20 bg-[#f4f6fb]">
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Awards', val: totalAwards },
            { label: 'Gold Medals', val: goldMedals },
            { label: 'National Titles', val: nationalTitles },
            { label: 'International', val: international },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl px-4 py-6 md:px-6 md:py-8 text-center shadow-sm border border-slate-100">
              <div className="text-2xl md:text-4xl font-extrabold text-rahula-blue">{stat.val}</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Year filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setYearFilter('ALL')}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${yearFilter === 'ALL' ? 'bg-rahula-blue text-white border-rahula-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-rahula-blue hover:text-rahula-blue'}`}
          >All</button>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => setYearFilter(y)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${yearFilter === y ? 'bg-rahula-blue text-white border-rahula-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-rahula-blue hover:text-rahula-blue'}`}
            >{y}</button>
          ))}
        </div>

        <hr className="border-slate-200 mb-8" />

        {/* Achievement list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No achievements found for this year.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  className="w-full px-6 py-5 flex items-center gap-5 text-left hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0f3fb] flex items-center justify-center shrink-0">
                    {placementIcon(a.placement)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-rahula-blue bg-[#e8ecf8] rounded px-2 py-0.5">{a.year}</span>
                      <span className="text-xs text-slate-500 font-medium">{a.placement}</span>
                    </div>
                    <h3 className="text-base font-bold text-rahula-blue leading-tight">{a.title}</h3>
                    {a.subtitle && <p className="text-sm text-slate-500 mt-0.5">{a.subtitle}</p>}
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {expandedId === a.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                {expandedId === a.id && a.description && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100">
                    {a.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
