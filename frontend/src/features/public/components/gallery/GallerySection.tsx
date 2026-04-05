'use client';

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { galleryService, GalleryItem, GalleryCategory } from '@/services/gallery.service';
import Image from 'next/image';

type FilterOption = 'ALL' | GalleryCategory;

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Performances', value: 'PERFORMANCES' },
  { label: 'Rehearsals', value: 'REHEARSALS' },
  { label: 'Awards', value: 'AWARDS' },
  { label: 'Cultural Events', value: 'CULTURAL_EVENTS' },
];

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  PERFORMANCES: 'Performances',
  REHEARSALS: 'Rehearsals',
  AWARDS: 'Awards',
  CULTURAL_EVENTS: 'Cultural Events',
};

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('ALL');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    galleryService.getAll().then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? items : items.filter(i => i.category === filter);

  const openLightbox = async (item: GalleryItem) => {
    setLightboxItem(item);
    await galleryService.incrementViews(item.id);
  };

  return (
    <>
      {/* Page Banner */}
      <section className="bg-[#f4f6fb] py-12 md:py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-rahula-blue mb-4 leading-tight">
          Gallery
        </h1>
        <p className="text-slate-500 text-base md:text-lg">Moments captured from our journey</p>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10">

          {/* Filter pills */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${filter === f.value ? 'bg-rahula-blue text-white border-rahula-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-rahula-blue hover:text-rahula-blue'}`}
              >{f.label}</button>
            ))}
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No media uploaded yet.</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300"
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative w-full aspect-video bg-slate-100">
                    <Image
                      src={galleryService.getMediaUrl(item.url)}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {item.mediaType === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                          <Play className="text-rahula-blue w-5 h-5 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h4 className="text-white font-bold text-sm leading-tight">{item.title}</h4>
                      <span className="text-white/70 text-xs">{CATEGORY_LABELS[item.category]}</span>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <h4 className="font-semibold text-rahula-blue text-sm leading-tight">{item.title}</h4>
                    <span className="text-xs text-slate-400">{CATEGORY_LABELS[item.category]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxItem(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightboxItem(null)}>
            <X size={28} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            {lightboxItem.mediaType === 'VIDEO' ? (
              <video
                src={galleryService.getMediaUrl(lightboxItem.url)}
                controls
                autoPlay
                className="w-full rounded-xl max-h-[80vh]"
              />
            ) : (
              <div className="relative w-full aspect-video">
                <Image
                  src={galleryService.getMediaUrl(lightboxItem.url)}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain rounded-xl"
                  sizes="100vw"
                />
              </div>
            )}
            <p className="text-white text-center mt-4 font-semibold text-lg">{lightboxItem.title}</p>
            <p className="text-white/50 text-center text-sm">{CATEGORY_LABELS[lightboxItem.category]}</p>
          </div>
        </div>
      )}
    </>
  );
}
