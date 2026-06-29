/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Filter, CheckCircle2, Star, Hourglass, Edit3, Save, Plus, X, 
  HelpCircle, ChevronDown, Check, Award
} from 'lucide-react';
import { AppState, Topic, TopicStatus } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface SubjectTrackerProps {
  appState: AppState;
  theme: ThemeConfig;
  onUpdateTopicStatus: (topicId: string, status: TopicStatus) => void;
  onUpdateTopicDetails: (topicId: string, status: TopicStatus, questionCount: number, duration: number) => void;
  onAddCustomTopic: (subjectId: string, name: string) => void;
}

export default function SubjectTracker({
  appState,
  theme,
  onUpdateTopicStatus,
  onUpdateTopicDetails,
  onAddCustomTopic
}: SubjectTrackerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState('turkce');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [customTopicName, setCustomTopicName] = useState('');
  const [showAddCustomForm, setShowAddCustomForm] = useState(false);

  // Modal State
  const [modalStatus, setModalStatus] = useState<TopicStatus>('BASLANMADI');
  const [modalQuestions, setModalQuestions] = useState(0);
  const [modalDuration, setModalDuration] = useState(0);

  const activeSubject = KPSS_SUBJECTS.find(s => s.id === selectedSubjectId) || KPSS_SUBJECTS[0];

  // Filter topics for the active subject
  const currentSubjectTopics = appState.topics.filter(t => t.subjectId === selectedSubjectId);

  // Search & Status filters
  const filteredTopics = currentSubjectTopics.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate subject completion percentage
  const totalTopics = currentSubjectTopics.length;
  const completedTopics = currentSubjectTopics.filter(t => t.status === 'TAMAMLANDI' || t.status === 'COK_IYI_BILIYORUM').length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const STATUS_CONFIGS: Record<TopicStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
    BASLANMADI: { label: 'Başlanmadı', bg: 'bg-slate-100 dark:bg-zinc-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400', border: 'border-slate-200' },
    CALISILIYOR: { label: 'Çalışılıyor', bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500 animate-pulse', border: 'border-blue-200/60' },
    TEKRAR_GEREKLI: { label: 'Tekrar Gerekli', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-200/60' },
    TAMAMLANDI: { label: 'Tamamlandı', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', border: 'border-emerald-200/60' },
    COK_IYI_BILIYORUM: { label: 'Çok İyi Biliyorum ⭐', bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', border: 'border-purple-200/60' }
  };

  const handleOpenEditModal = (topic: Topic) => {
    setEditingTopic(topic);
    setModalStatus(topic.status);
    setModalQuestions(topic.questionCount);
    setModalDuration(topic.studyDuration);
  };

  const handleSaveTopicDetails = () => {
    if (editingTopic) {
      onUpdateTopicDetails(editingTopic.id, modalStatus, Number(modalQuestions), Number(modalDuration));
      setEditingTopic(null);
    }
  };

  const handleAddCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopicName.trim()) {
      onAddCustomTopic(selectedSubjectId, customTopicName.trim());
      setCustomTopicName('');
      setShowAddCustomForm(false);
    }
  };

  return (
    <div className="space-y-6" id="subject_tracker_tab">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-rose-500" />
          Müfredat & Konu Takip Paneli
        </h2>
        <p className="text-sm mt-1 text-slate-400 font-medium">
          KPSS Ortaöğretim konularını tamamla, durumlarını takip et ve gelişimini izle.
        </p>
      </div>

      {/* Subjects Switcher - Horizontal Scrollable Row */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {KPSS_SUBJECTS.map((subject) => {
          const isActive = selectedSubjectId === subject.id;
          const completedCount = appState.topics.filter(t => t.subjectId === subject.id && (t.status === 'TAMAMLANDI' || t.status === 'COK_IYI_BILIYORUM')).length;
          const totalCount = appState.topics.filter(t => t.subjectId === subject.id).length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubjectId(subject.id);
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className={`px-5 py-4.5 rounded-2xl border shrink-0 transition-all duration-300 text-left min-w-[155px] cursor-pointer ${
                isActive 
                  ? `${theme.cardBg} ring-2 ring-pink-400 shadow-md` 
                  : 'bg-white dark:bg-zinc-900 border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DERS</span>
                <span className="text-xs font-bold font-mono text-emerald-500">{pct}%</span>
              </div>
              <h4 className="font-extrabold text-sm" style={{ color: isActive ? activeSubject.color : undefined }}>
                {subject.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {completedCount} / {totalCount} Konu
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Dashboard */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: activeSubject.color }} />
              <h3 className="text-xl font-extrabold" style={{ color: activeSubject.color }}>
                {activeSubject.name} Müfredatı
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Sınavda bu dersten sorumlu olduğun toplam konu sayısı: {totalTopics}
            </p>
          </div>

          {/* Subject Completion details */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-500/5 px-4 py-3 rounded-2xl border border-slate-200/5 pr-6">
            <div className="relative w-12 h-12 flex items-center justify-center font-mono font-black text-sm text-emerald-500 shrink-0">
              {completionPercentage}%
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" className="text-emerald-500" strokeWidth="4" strokeDasharray={125} strokeDashoffset={125 - (125 * completionPercentage) / 100} />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">TAMAMLANAN</span>
              <span className="text-base font-extrabold">{completedTopics} / {totalTopics} Konu</span>
            </div>
          </div>
        </div>

        {/* Search and Filters row */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Konularda ara..."
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                theme.id === 'night' || theme.id === 'neon'
                  ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                  : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
              }`}
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Filter select */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`pl-10 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer font-medium ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                    : 'bg-white border-slate-200 focus:ring-rose-200'
                }`}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="BASLANMADI">Başlanmadı</option>
                <option value="CALISILIYOR">Çalışılıyor</option>
                <option value="TEKRAR_GEREKLI">Tekrar Gerekli</option>
                <option value="TAMAMLANDI">Tamamlandı</option>
                <option value="COK_IYI_BILIYORUM">Çok İyi Biliyorum</option>
              </select>
              <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Add Custom Topic Button */}
            <button
              onClick={() => setShowAddCustomForm(!showAddCustomForm)}
              className={`px-4.5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-1.5 cursor-pointer shadow-sm ${theme.primary} ${theme.primaryHover}`}
            >
              <Plus className="w-4 h-4" />
              Özel Konu
            </button>
          </div>
        </div>

        {/* Add Custom Topic Inline Form */}
        <AnimatePresence>
          {showAddCustomForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCustomTopicSubmit}
              className="mt-4 p-4 rounded-2xl bg-slate-500/5 border border-dashed flex gap-3 items-center"
            >
              <input
                type="text"
                value={customTopicName}
                onChange={(e) => setCustomTopicName(e.target.value)}
                placeholder="Örn. Sözcük Türleri Pratik Kampı"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                    : 'bg-white border-slate-200 focus:ring-rose-200'
                }`}
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomForm(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Topics List grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredTopics.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
              <HelpCircle className="w-10 h-10 opacity-45" />
              Arama kriterlerine uygun konu bulunamadı.
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const statusCfg = STATUS_CONFIGS[topic.status];
              return (
                <div 
                  key={topic.id}
                  className="p-4 rounded-2xl border border-slate-100/85 hover:border-slate-300 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between gap-3 group transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-100 group-hover:text-slate-900 leading-tight">
                        {topic.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          {topic.questionCount} Soru
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Hourglass className="w-3.5 h-3.5 text-violet-500" />
                          {topic.studyDuration} dk Çalışma
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(topic)}
                      className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between border-t pt-3 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Durum</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot}`} />
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Topic Drawer / Modal Overlay */}
      <AnimatePresence>
        {editingTopic && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`w-full max-w-lg ${theme.cardBg} rounded-3xl p-6.5 border shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 to-violet-400" />
              
              <div className="flex justify-between items-start mb-5 pb-3 border-b">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">KONU DETAYLARINI DÜZENLE</span>
                  <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-100 mt-1">
                    {editingTopic.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingTopic(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Çalışma Durumu
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(Object.keys(STATUS_CONFIGS) as TopicStatus[]).map((statusKey) => {
                      const cfg = STATUS_CONFIGS[statusKey];
                      const isSel = modalStatus === statusKey;
                      return (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => setModalStatus(statusKey)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all ${
                            isSel 
                              ? `${cfg.bg} border-${theme.accent} ring-2 ring-${theme.accent} shadow-sm` 
                              : 'bg-white dark:bg-zinc-900 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className={isSel ? cfg.text : 'text-slate-600 dark:text-slate-400'}>{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Count & Duration fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Çözülen Soru Sayısı
                    </label>
                    <input
                      type="number"
                      value={modalQuestions}
                      onChange={(e) => setModalQuestions(Math.max(0, Number(e.target.value)))}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                        theme.id === 'night' || theme.id === 'neon'
                          ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Çalışma Süresi (Dakika)
                    </label>
                    <input
                      type="number"
                      value={modalDuration}
                      onChange={(e) => setModalDuration(Math.max(0, Number(e.target.value)))}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                        theme.id === 'night' || theme.id === 'neon'
                          ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div className="flex justify-end gap-3 border-t pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-5 py-3 rounded-xl border text-slate-500 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleSaveTopicDetails}
                  className={`px-6 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover}`}
                >
                  <Save className="w-4.5 h-4.5" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
