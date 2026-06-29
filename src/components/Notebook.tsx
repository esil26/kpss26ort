/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Plus, Trash2, Search, Tag, Image, Save, X, HelpCircle, FileText, 
  ExternalLink, Sparkles
} from 'lucide-react';
import { AppState, NotebookNote } from '../types';
import { ThemeConfig } from '../lib/themeUtils';

interface NotebookProps {
  appState: AppState;
  theme: ThemeConfig;
  onAddNote: (note: Omit<NotebookNote, 'id' | 'date'>) => void;
  onDeleteNote: (id: string) => void;
}

export default function Notebook({
  appState,
  theme,
  onAddNote,
  onDeleteNote
}: NotebookProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [rawTags, setRawTags] = useState('Matematik, Kısa Bilgi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Split tags by comma
    const parsedTags = rawTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      attachmentUrl: attachmentUrl.trim() || undefined,
      tags: parsedTags
    });

    // Reset fields
    setTitle('');
    setContent('');
    setAttachmentUrl('');
    setRawTags('Kısa Not');
    setShowAddForm(false);
  };

  // Extract all unique tags
  const allUniqueTags = Array.from(
    new Set(appState.notes.flatMap(note => note.tags))
  );

  // Filter notes
  const filteredNotes = appState.notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6" id="notebook_tab">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-500" />
            Özel Ders Not Defteri
          </h2>
          <p className="text-sm mt-1 text-slate-400 font-medium">
            Kendi çalışma özetlerini, önemli formülleri, tarih şifrelerini ve görsel soru çözümlerini kaydet.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover} self-start`}
        >
          <Plus className="w-4.5 h-4.5" />
          Yeni Not Ekle
        </button>
      </div>

      {/* Add Note Panel Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl ${theme.cardBg} border shadow-lg`}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-rose-500" />
                Zihnine Kazınacak Önemli Bir Not Al
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Not Başlığı
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn. Tarih - Amasya Genelgesi Şifresi"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Etiketler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={rawTags}
                    onChange={(e) => setRawTags(e.target.value)}
                    placeholder="Örn. Tarih, Şifreleme, Önemli"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Görsel veya Kaynak URL Linki (İsteğe Bağlı)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Image className="w-5 h-5" />
                  </span>
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Örn. https://example.com/soru-cozumu.jpg veya Google Drive linki"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Not İçeriği
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Notunuzu buraya yazın..."
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2.5 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl border text-slate-500 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover}`}
                >
                  <Save className="w-4 h-4" />
                  Notu Kaydet
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and search bar */}
      <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col md:flex-row gap-4 items-center`}>
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Notlarda anahtar kelime ara..."
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
              theme.id === 'night' || theme.id === 'neon'
                ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
            }`}
          />
        </div>

        {/* Tags select */}
        <div className="flex gap-2 shrink-0 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
              selectedTag === 'all' 
                ? `${theme.primary} text-white` 
                : 'bg-white dark:bg-zinc-900 border-slate-200 text-slate-500'
            }`}
          >
            Tüm Notlar
          </button>
          {allUniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag 
                  ? 'bg-violet-500 text-white border-violet-500' 
                  : 'bg-white dark:bg-zinc-900 border-slate-200 text-slate-500'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky note card deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 text-xs flex flex-col items-center gap-2">
            <BookOpen className="w-12 h-12 opacity-45 text-rose-400" />
            <span>Henüz bir not eklenmemiş veya arama kriterine uygun not bulunamadı.</span>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id}
              className="p-5 rounded-2xl border bg-yellow-50/75 dark:bg-zinc-900 border-yellow-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300 min-h-[200px]"
            >
              {/* Note Content */}
              <div>
                <div className="flex justify-between items-start gap-2 border-b border-yellow-200/50 pb-2.5 mb-3">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                    {note.title}
                  </h4>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-300 group-hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Optional Attachment Link */}
                {note.attachmentUrl && (
                  <a 
                    href={note.attachmentUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-3 py-1.5 px-3 rounded-lg bg-white dark:bg-zinc-800 border text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 w-max cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ekli Kaynağı Aç
                  </a>
                )}
              </div>

              {/* Tag and Date Footer */}
              <div className="flex justify-between items-center border-t border-yellow-200/30 pt-3.5 mt-4">
                <div className="flex gap-1 overflow-hidden">
                  {note.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[9px] font-bold bg-yellow-100/60 dark:bg-zinc-800 text-yellow-800 dark:text-zinc-400 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 font-mono font-bold">{note.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
