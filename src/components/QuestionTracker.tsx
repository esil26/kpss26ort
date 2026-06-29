/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, Plus, Calendar, BarChart3, TrendingUp, HelpCircle, Save, Award, Check
} from 'lucide-react';
import { AppState } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface QuestionTrackerProps {
  appState: AppState;
  theme: ThemeConfig;
  onLogQuestions: (subjectId: string, topicId: string, questionsCount: number) => void;
}

export default function QuestionTracker({
  appState,
  theme,
  onLogQuestions
}: QuestionTrackerProps) {
  const [subjectId, setSubjectId] = useState('turkce');
  const [topicId, setTopicId] = useState('');
  const [questionsCount, setQuestionsCount] = useState(50);
  const [successMsg, setSuccessMsg] = useState('');

  const activeSubjectTopics = appState.topics.filter(t => t.subjectId === subjectId);

  // Auto set first topic when subject changes
  React.useEffect(() => {
    if (activeSubjectTopics.length > 0) {
      setTopicId(activeSubjectTopics[0].id);
    } else {
      setTopicId('');
    }
  }, [subjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !topicId || questionsCount <= 0) return;

    onLogQuestions(subjectId, topicId, Number(questionsCount));
    
    setSuccessMsg('Soru sayınız başarıyla kaydedildi! +20 XP');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const getSubjectNameAndColor = (id: string) => {
    const subject = KPSS_SUBJECTS.find(s => s.id === id);
    return subject ? { name: subject.name, color: subject.color } : { name: 'Genel', color: '#64748b' };
  };

  // Stats calculations
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Daily questions
  const dailyQuestions = appState.studySessions
    .filter(s => s.date === todayStr)
    .reduce((sum, s) => sum + s.questionsSolved, 0);

  // Weekly questions (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyQuestions = appState.studySessions
    .filter(s => new Date(s.date) >= oneWeekAgo)
    .reduce((sum, s) => sum + s.questionsSolved, 0);

  // Total questions
  const totalQuestions = appState.studySessions.reduce((sum, s) => sum + s.questionsSolved, 0);

  // Last 7 Days chart data calculation
  const getLast7DaysData = () => {
    const result = [];
    const daysArr = ['Pazar', 'Pzt', 'Salı', 'Çarş', 'Perş', 'Cuma', 'Cmt'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = daysArr[d.getDay()];
      
      const daySum = appState.studySessions
        .filter(s => s.date === dateStr)
        .reduce((sum, s) => sum + s.questionsSolved, 0);
      
      result.push({ dayLabel: dayName, count: daySum, dateStr });
    }
    return result;
  };

  const last7DaysData = getLast7DaysData();
  const maxIn7Days = Math.max(...last7DaysData.map(d => d.count), 10);

  // Course wise questions calculation
  const getCourseBreakdown = () => {
    return KPSS_SUBJECTS.map(sub => {
      const count = appState.studySessions
        .filter(s => s.subjectId === sub.id)
        .reduce((sum, s) => sum + s.questionsSolved, 0);
      return {
        ...sub,
        count
      };
    });
  };

  const courseBreakdown = getCourseBreakdown();

  return (
    <div className="space-y-6" id="questions_tab">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Target className="w-6 h-6 text-rose-500" />
          Soru Çözüm Takip Merkezi
        </h2>
        <p className="text-sm mt-1 text-slate-400 font-medium">
          Ders bazlı çözdüğün soru sayılarını kaydet, günlük hedeflerine ulaş ve istatistiklerini gör.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bugun */}
        <div className={`p-6.5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-5 relative overflow-hidden`}>
          <div className="p-4 bg-pink-100 dark:bg-pink-950/50 text-pink-500 rounded-2xl shrink-0">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Bugün Çözülen</span>
            <span className="text-3xl font-black">{dailyQuestions} Soru</span>
            <span className="text-xs text-slate-400 block mt-1.5 font-medium">Günlük Hedef: {appState.profile.dailyQuestionGoal}</span>
          </div>
        </div>

        {/* Bu Hafta */}
        <div className={`p-6.5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-5 relative overflow-hidden`}>
          <div className="p-4 bg-violet-100 dark:bg-violet-950/50 text-violet-500 rounded-2xl shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Son 7 Gün</span>
            <span className="text-3xl font-black">{weeklyQuestions} Soru</span>
            <span className="text-xs text-slate-400 block mt-1.5 font-medium">Haftalık Toplam</span>
          </div>
        </div>

        {/* Toplam */}
        <div className={`p-6.5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-5 relative overflow-hidden`}>
          <div className="p-4 bg-amber-100 dark:bg-amber-950/50 text-amber-500 rounded-2xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Toplam Çözülen</span>
            <span className="text-3xl font-black">{totalQuestions} Soru</span>
            <span className="text-xs text-slate-400 block mt-1.5 font-medium">Tüm Zamanlar Birikimi</span>
          </div>
        </div>
      </div>

      {/* Logging form and breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Log Form */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3.5 mb-5">
              <Plus className="w-5 h-5 text-rose-500" />
              Hızlı Soru Kaydı Ekle
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Ders
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
                  Konu
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
                    <option value="">Konu yok</option>
                  ) : (
                    activeSubjectTopics.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Soru Sayısı
                </label>
                <input
                  type="number"
                  value={questionsCount}
                  onChange={(e) => setQuestionsCount(Math.max(1, Number(e.target.value)))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                />
              </div>

              {/* Success message */}
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 text-xs px-4 py-2 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white text-xs cursor-pointer shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-1.5 ${theme.primary} ${theme.primaryHover}`}
              >
                <Save className="w-4 h-4" />
                Soru Sayısını Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* Last 7 Days Custom SVG Bar Chart */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3.5 mb-5">
              <BarChart3 className="w-5 h-5 text-violet-500" />
              Son 7 Günlük Soru Grafiği
            </h3>

            {/* SVG Graph Drawing */}
            <div className="h-52 w-full flex items-end justify-between px-1 pt-6 relative border-b pb-2">
              
              {/* Background horizontal lines */}
              <div className="absolute inset-x-0 top-6 border-t border-dashed border-slate-200/40" />
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200/40" />

              {last7DaysData.map((d, index) => {
                const heightPct = Math.max(5, Math.round((d.count / maxIn7Days) * 100));
                return (
                  <div key={index} className="flex flex-col items-center flex-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      {d.count} Soru
                    </div>

                    {/* Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`w-6 bg-gradient-to-t ${theme.gradient} rounded-t-md hover:opacity-85 shadow-sm transition-all cursor-pointer`}
                    />
                    
                    {/* Label */}
                    <span className="text-[9px] font-bold text-slate-400 mt-2 rotate-[-25deg] origin-center sm:rotate-0">
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4">
            * Grafikte her gün tamamladığın çalışma sürelerinde veya el ile kaydettiğin soru sayıları listelenir.
          </p>
        </div>

        {/* Course wise breakdown */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
          <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3.5 mb-5">
            <Calendar className="w-5 h-5 text-amber-500" />
            Ders Bazlı Soru Dağılımı
          </h3>

          <div className="space-y-4 max-h-[310px] overflow-y-auto pr-1">
            {courseBreakdown.map((item) => {
              // Calculate % out of total
              const percentage = totalQuestions > 0 ? Math.round((item.count / totalQuestions) * 100) : 0;
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span style={{ color: item.color }}>{item.name}</span>
                    <span className="text-slate-500 font-mono">{item.count} Soru ({percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${percentage}%` 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
