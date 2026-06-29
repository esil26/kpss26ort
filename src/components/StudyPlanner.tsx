/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Plus, Clock, Target, Trash2, CheckSquare, Square, Check, X, 
  ChevronRight, AlertCircle, HelpCircle
} from 'lucide-react';
import { AppState, ProgramItem } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface StudyPlannerProps {
  appState: AppState;
  theme: ThemeConfig;
  onAddProgramItem: (item: Omit<ProgramItem, 'id' | 'completed'>) => void;
  onToggleProgramItem: (id: string) => void;
  onDeleteProgramItem: (id: string) => void;
}

const TURKISH_DAYS = [
  { val: 1, label: 'Pazartesi' },
  { val: 2, label: 'Salı' },
  { val: 3, label: 'Çarşamba' },
  { val: 4, label: 'Perşembe' },
  { val: 5, label: 'Cuma' },
  { val: 6, label: 'Cumartesi' },
  { val: 0, label: 'Pazar' }
];

export default function StudyPlanner({
  appState,
  theme,
  onAddProgramItem,
  onToggleProgramItem,
  onDeleteProgramItem
}: StudyPlannerProps) {
  const [selectedDay, setSelectedDay] = useState(1); // Default to Monday (1)
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [subjectId, setSubjectId] = useState('turkce');
  const [topicId, setTopicId] = useState('');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [questionGoal, setQuestionGoal] = useState(40);

  const activeSubjectTopics = appState.topics.filter(t => t.subjectId === subjectId);

  // Auto select first topic of subject when subject changes
  React.useEffect(() => {
    if (activeSubjectTopics.length > 0) {
      setTopicId(activeSubjectTopics[0].id);
    } else {
      setTopicId('');
    }
  }, [subjectId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !topicId) return;

    onAddProgramItem({
      dayOfWeek: selectedDay,
      subjectId,
      topicId,
      timeStart,
      timeEnd,
      questionGoal: Number(questionGoal)
    });

    // Reset fields & close
    setShowAddForm(false);
  };

  const getSubjectNameAndColor = (id: string) => {
    const subject = KPSS_SUBJECTS.find(s => s.id === id);
    return subject ? { name: subject.name, color: subject.color } : { name: 'Genel', color: '#64748b' };
  };

  const getTopicName = (id: string) => {
    const topic = appState.topics.find(t => t.id === id);
    return topic ? topic.name : 'Genel Konu';
  };

  // Filter items for selected day, sorted by time
  const dayItems = appState.programItems
    .filter(item => item.dayOfWeek === selectedDay)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  return (
    <div className="space-y-6" id="study_planner_tab">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-rose-500" />
            Haftalık Ders Çalışma Programı
          </h2>
          <p className="text-sm mt-1 text-slate-400 font-medium">
            Her güne özel ders, konu ve soru hedeflerini belirleyerek düzenli çalış.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover} self-start`}
        >
          <Plus className="w-4.5 h-4.5" />
          Programa Ders Ekle
        </button>
      </div>

      {/* Days Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {TURKISH_DAYS.map((day) => {
          const isSelected = selectedDay === day.val;
          const itemsCount = appState.programItems.filter(item => item.dayOfWeek === day.val).length;
          const completedCount = appState.programItems.filter(item => item.dayOfWeek === day.val && item.completed).length;

          return (
            <button
              key={day.val}
              onClick={() => setSelectedDay(day.val)}
              className={`px-4.5 py-4 rounded-2xl border shrink-0 font-bold text-xs transition-all duration-300 text-left min-w-[110px] cursor-pointer ${
                isSelected 
                  ? `${theme.cardBg} ring-2 ring-pink-400 shadow-md` 
                  : 'bg-white dark:bg-zinc-900 border-slate-100/80 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">GÜN</span>
                {itemsCount > 0 && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    completedCount === itemsCount ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {completedCount}/{itemsCount}
                  </span>
                )}
              </div>
              <span className="text-slate-800 dark:text-slate-100 text-sm block mt-0.5">{day.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Program Item Modal / Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl ${theme.cardBg} border shadow-lg`}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-100">
                {TURKISH_DAYS.find(d => d.val === selectedDay)?.label} Gününe Yeni Ders Planla
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Ders Seçimi
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

              {/* Topic Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Konu Seçimi
                </label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                      : 'bg-white border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                >
                  {activeSubjectTopics.length === 0 ? (
                    <option value="">Konu bulunamadı</option>
                  ) : (
                    activeSubjectTopics.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Times and Question Goal */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Başlangıç
                  </label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium text-center focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-white border-slate-200 focus:ring-rose-200'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Bitiş
                  </label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium text-center focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-white border-slate-200 focus:ring-rose-200'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Soru Hedefi
                  </label>
                  <input
                    type="number"
                    value={questionGoal}
                    onChange={(e) => setQuestionGoal(Math.max(1, Number(e.target.value)))}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium text-center focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-white border-slate-200 focus:ring-rose-200'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Submit Row */}
              <div className="col-span-full flex justify-end gap-2.5 border-t pt-4 mt-2">
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
                  Programa Ekle
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Program items list */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <div className="flex justify-between items-center border-b pb-4 mb-5">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            {TURKISH_DAYS.find(d => d.val === selectedDay)?.label} Ders Listesi
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            Toplam: {dayItems.length} Ders Planlı
          </span>
        </div>

        <div className="space-y-4">
          {dayItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center gap-2.5">
              <AlertCircle className="w-9 h-9 opacity-45 text-rose-400 animate-pulse" />
              <span>{TURKISH_DAYS.find(d => d.val === selectedDay)?.label} günü için henüz bir ders planlanmamış.</span>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs font-semibold text-rose-500 hover:underline mt-1"
              >
                Hemen bir çalışma ekle
              </button>
            </div>
          ) : (
            dayItems.map((item) => {
              const subDetails = getSubjectNameAndColor(item.subjectId);
              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                    item.completed 
                      ? 'bg-slate-100/50 dark:bg-zinc-800/40 border-slate-200 opacity-65 text-slate-400' 
                      : 'bg-white dark:bg-zinc-900 border-slate-100/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Left part: Course Info & Time */}
                  <div className="flex items-start gap-3.5">
                    {/* Time block */}
                    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-slate-200/50 min-w-[75px]">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono">
                        {item.timeStart}
                      </span>
                      <div className="h-2.5 w-[1px] bg-slate-300 dark:bg-zinc-700 my-0.5" />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.timeEnd}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: subDetails.color }}
                        />
                        <span className="text-xs font-extrabold" style={{ color: subDetails.color }}>
                          {subDetails.name}
                        </span>
                      </div>
                      <h4 className={`text-base font-bold mt-1 leading-tight ${item.completed ? 'line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                        {getTopicName(item.topicId)}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
                        <Target className="w-3.5 h-3.5" />
                        <span>Soru Hedefi: {item.questionGoal} Soru</span>
                      </div>
                    </div>
                  </div>

                  {/* Right part: Action Buttons */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      type="button"
                      onClick={() => onToggleProgramItem(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.completed 
                          ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500 border-slate-200/80 hover:border-emerald-500'
                      }`}
                    >
                      {item.completed ? (
                        <>
                          <Check className="w-4 h-4" /> Tamamlandı
                        </>
                      ) : (
                        'Çalışmayı Tamamla'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProgramItem(item.id)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
