/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Plus, Trash2, Save, X, BookMarked, HelpCircle, CheckCircle, 
  ChevronRight, Sparkles, Edit3
} from 'lucide-react';
import { AppState, BookRecord } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface BooksTrackerProps {
  appState: AppState;
  theme: ThemeConfig;
  onAddBook: (book: Omit<BookRecord, 'id' | 'solvedQuestions' | 'status'>) => void;
  onUpdateBookProgress: (id: string, solvedQuestions: number) => void;
  onDeleteBook: (id: string) => void;
}

export default function BooksTracker({
  appState,
  theme,
  onAddBook,
  onUpdateBookProgress,
  onDeleteBook
}: BooksTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [solveIncrement, setSolveIncrement] = useState(50);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subjectId, setSubjectId] = useState('turkce');
  const [totalQuestions, setTotalQuestions] = useState(800);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onAddBook({
      title: title.trim(),
      author: author.trim(),
      subjectId,
      totalQuestions: Number(totalQuestions)
    });

    // Reset fields
    setTitle('');
    setAuthor('');
    setTotalQuestions(800);
    setShowAddForm(false);
  };

  const getSubjectNameAndColor = (id: string) => {
    const subject = KPSS_SUBJECTS.find(s => s.id === id);
    return subject ? { name: subject.name, color: subject.color } : { name: 'Genel', color: '#64748b' };
  };

  const handleAddSolveCount = (book: BookRecord) => {
    const newSolved = Math.min(book.totalQuestions, book.solvedQuestions + solveIncrement);
    onUpdateBookProgress(book.id, newSolved);
    setEditingBookId(null);
  };

  return (
    <div className="space-y-6" id="books_tab">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-rose-500" />
            Kaynak Kitap Takip Sistemi
          </h2>
          <p className="text-sm mt-1 text-slate-400 font-medium">
            Kullandığın soru bankalarını ve konu anlatımlı kitapları ekle, çözüm yüzdelerini ve bitirme durumlarını izle.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover} self-start`}
        >
          <Plus className="w-4.5 h-4.5" />
          Yeni Kitap Ekle
        </button>
      </div>

      {/* Add book form */}
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
                Müfredata Yeni Kitap Ekle
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Kitap Adı
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn. Pegem Ezberbozan Soru Bankası"
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
                  Yazar / Yayıncı
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Örn. Komisyon"
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
                  Ders İlişkisi
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                      : 'bg-white border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                >
                  {KPSS_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Toplam Soru Sayısı (Tahmini)
                </label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Math.max(10, Number(e.target.value)))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                />
              </div>

              <div className="col-span-full flex justify-end gap-2.5 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl border text-slate-500 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover}`}
                >
                  Kitabı Kaydet
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Books listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appState.books.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-zinc-900 border rounded-3xl text-slate-400 text-xs flex flex-col items-center gap-2">
            <BookMarked className="w-12 h-12 opacity-45 text-rose-400" />
            <span>Henüz eklenmiş kaynak kitap bulunmuyor. Hazırlık kitaplarını hemen ekle!</span>
          </div>
        ) : (
          appState.books.map((book) => {
            const subDetails = getSubjectNameAndColor(book.subjectId);
            const progressPct = Math.round((book.solvedQuestions / book.totalQuestions) * 100);
            const isEditing = editingBookId === book.id;

            return (
              <div 
                key={book.id}
                className="p-5 rounded-2xl border border-slate-100/90 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between gap-4 group hover:shadow-md transition-all duration-300"
              >
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start gap-2 border-b pb-2.5 mb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${subDetails.color}15`, color: subDetails.color }}>
                        {subDetails.name}
                      </span>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1.5 leading-tight">
                        {book.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">Yazar: {book.author}</span>
                    </div>

                    <button
                      onClick={() => onDeleteBook(book.id)}
                      className="text-slate-300 group-hover:text-red-500 p-1.5 rounded-md hover:bg-red-50/50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Solution progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Çözüm Oranı</span>
                      <span className="font-mono">{book.solvedQuestions} / {book.totalQuestions} ({progressPct}%)</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: subDetails.color,
                          width: `${progressPct}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Inline Progress Editor Row */}
                <div className="border-t pt-3 flex justify-between items-center gap-2">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div 
                        key="edit"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="flex gap-2 items-center w-full"
                      >
                        <input
                          type="number"
                          value={solveIncrement}
                          onChange={(e) => setSolveIncrement(Math.max(1, Number(e.target.value)))}
                          placeholder="Adet"
                          className="px-2 py-1 border text-xs font-bold w-20 rounded-lg text-center focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSolveCount(book)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-[10px] flex-1 text-center cursor-pointer hover:bg-emerald-600"
                        >
                          Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBookId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="buttons"
                        className="flex items-center justify-between w-full"
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          progressPct >= 100 ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {progressPct >= 100 ? '✓ TAMAMLANDI' : 'DEVAM EDİYOR'}
                        </span>

                        {progressPct < 100 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBookId(book.id);
                              setSolveIncrement(50);
                            }}
                            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Soru Ekle
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
