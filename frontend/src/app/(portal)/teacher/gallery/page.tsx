'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Upload, Trash2, Play, Eye } from 'lucide-react';
import { galleryService, GalleryItem, GalleryCategory } from '@/services/gallery.service';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import Image from 'next/image';

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  PERFORMANCES: 'Performances',
  REHEARSALS: 'Rehearsals',
  AWARDS: 'Awards',
  CULTURAL_EVENTS: 'Cultural Events',
};

function UploadModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('PERFORMANCES');
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setFile(null); setTitle(''); setCategory('PERFORMANCES'); setPreview(null); setError(null); };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) { setError('File and title are required'); return; }
    try {
      setIsUploading(true);
      await galleryService.upload(file, title, category);
      onSuccess();
      onClose();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const isVideo = file?.type.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-rahula-blue">Upload Media</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-rahula-blue hover:bg-slate-50/50 transition-all"
          >
            {preview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                {isVideo ? (
                  <video src={preview} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Image src={preview} alt="preview" fill unoptimized className="object-cover rounded-lg" sizes="400px" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload size={32} />
                <p className="font-medium text-sm">Drop or click to upload</p>
                <p className="text-xs">Images & Videos up to 50MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Annual Performance 2026"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as GalleryCategory)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50 appearance-none"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-5 py-2.5 rounded-lg font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isUploading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Uploading...</span></> : <><Upload size={16} /><span>Upload</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeacherGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<GalleryItem | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!confirmItem) return;
    const id = confirmItem.id;
    try {
      setDeleting(id);
      await galleryService.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setConfirmItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
        <p className="text-sm text-slate-500 mt-1">Upload and manage photos & videos for the public gallery</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search gallery..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rahula-blue text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Upload size={18} />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center text-slate-400">
          No media uploaded yet. Click &quot;Upload Media&quot; to add photos or videos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-slate-100">
                <Image
                  src={galleryService.getMediaUrl(item.url)}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {item.mediaType === 'VIDEO' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-rahula-blue/90 rounded-full flex items-center justify-center shadow-md">
                      <Play className="text-white w-5 h-5 ml-0.5" fill="white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-800 leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(item.date).toLocaleDateString('en-GB')}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-md ${item.mediaType === 'VIDEO' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {item.mediaType === 'VIDEO' ? 'Video' : 'Photo'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Eye size={13} />
                  <span>{item.views} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <a
                  href={galleryService.getMediaUrl(item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-rahula-blue hover:underline"
                >
                  View
                </a>
                <button
                  onClick={() => setConfirmItem(item)}
                  disabled={deleting === item.id}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                >
                  {deleting === item.id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={load} />

      <ConfirmDialog
        isOpen={!!confirmItem}
        title="Delete Media"
        message={<>Are you sure you want to delete <strong className="text-slate-900">{confirmItem?.title}</strong>? This media will be permanently removed from the gallery.</>}
        confirmLabel="Yes, Delete"
        variant="danger"
        isLoading={deleting === confirmItem?.id}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirmItem(null)}
      />
    </div>
  );
}
