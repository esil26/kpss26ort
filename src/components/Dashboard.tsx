/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Sparkles, Plus, CheckCircle, Circle, Trash2, Calendar, Target, Clock, 
  Award, TrendingUp, CheckCircle2, ChevronRight, BookOpen, AlertCircle
} from 'lucide-react';
import { AppState, DailyGoal, ProgramItem } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { MOTIVATIONAL_QUOTES, KPSS_SUBJECTS } from '../data/kpssData';

interface DashboardProps {
  appState: AppState;
  theme: ThemeConfig;
  onAddDailyGoal: (text: string) => void;
  onToggleDailyGoal: (id: string) => void;
  onDeleteDailyGoal: (id: string) => void;
  onToggleProgramItem: (id: string) => void;
  onSetActiveTab: (tab: string) => void;
}

export default function Dashboard({
  appState,
  theme,
  onAddDailyGoal,
  onToggleDailyGoal,
  onDeleteDailyGoal,
  onToggleProgramItem,
  onSetActiveTab
}: DashboardProps) {
  const [newGoal, setNewGoal] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [quote, setQuote] = useState('');

  // Target date: KPSS Ortaöğretim 2026 (Nov 22, 2026)
  const examDate = new Date('2026-11-22T10:00:00');

  useEffect(() => {
    // Pick motivational quote based on day
    const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setQuote(MOTIVATIONAL_QUOTES[dayIndex]);

    const calculateTime = () => {
      const difference = +examDate - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        setCountdown({ days, hours, minutes });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddDailyGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  // Get current day's program items (0: Pazar, 1: Pazartesi, ...)
  const currentDayOfWeek = new Date().getDay();
  const todaysProgram = appState.programItems.filter(item => item.dayOfWeek === currentDayOfWeek);

  // Quick Stats Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = appState.studySessions.filter(s => s.date === todayStr);
  const todaysQuestions = todaysSessions.reduce((sum, s) => sum + s.questionsSolved, 0);
  const todaysStudyMinutes = Math.round(todaysSessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  // XP Progress %
  const currentLevelXp = appState.profile.level * 500; // XP needed to level up
  const xpPercentage = Math.min(100, Math.round((appState.profile.xp / currentLevelXp) * 100));

  // Subject details lookup
  const getSubjectNameAndColor = (id: string) => {
    const subject = KPSS_SUBJECTS.find(s => s.id === id);
    return subject ? { name: subject.name, color: subject.color } : { name: 'Genel', color: '#64748b' };
  };

  const getTopicName = (id: string) => {
    const topic = appState.topics.find(t => t.id === id);
    return topic ? topic.name : 'Genel Konu';
  };

  // Calculate overall syllabus progress %
  const completedTopics = appState.topics.filter(t => t.status === 'TAMAMLANDI' || t.status === 'COK_IYI_BILIYORUM').length;
  const overallProgressPercent = appState.topics.length > 0 
    ? Math.round((completedTopics / appState.topics.length) * 100) 
    : 0;

  return (
    <div className="space-y-6" id="dashboard_tab">
      
      {/* 1. PROFESSIONAL POLISH HEADER */}
      <header className="pb-6 border-b border-[#F3E8FF] dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            İyi Günler, {appState.profile.name} ✨
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium mt-1">
            "{quote || 'Başarı, her gün tekrarlanan küçük disiplinlerin toplamıdır.'}"
          </p>
        </div>
        <div className="flex items-center gap-6 self-start sm:self-auto">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-pink-400 dark:text-pink-500 uppercase tracking-widest">KPSS 2026'YA KALAN</span>
            <span className="text-2xl font-black text-pink-500 tracking-tighter">
              {countdown.days} <span className="text-xs font-bold text-slate-400">GÜN</span>
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.gradient} border-2 border-white dark:border-zinc-900 shadow-md flex items-center justify-center text-white font-black text-lg italic shrink-0`}>
            {appState.profile.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* 2. PROFESSIONAL POLISH 4-COLUMN STATS BENTO-GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Bugünkü Soru */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between min-h-[130px]`}>
          <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-tight">Bugünkü Soru</div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
            {todaysQuestions} / <span className="text-slate-300 dark:text-slate-700">{appState.profile.dailyQuestionGoal}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-pink-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((todaysQuestions / appState.profile.dailyQuestionGoal) * 100))}%` }}
            />
          </div>
        </div>

        {/* Card 2: Çalışma Süresi */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between min-h-[130px]`}>
          <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-tight">Çalışma Süresi</div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
            {String(Math.floor(todaysStudyMinutes / 60)).padStart(2, '0')}
            <span className="text-pink-300 dark:text-pink-600">:</span>
            {String(todaysStudyMinutes % 60).padStart(2, '0')}
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold ml-1.5">sa</span>
          </div>
          <div className="text-[10px] text-green-500 font-extrabold mt-3 flex items-center gap-1">
            <span>🚀 Verimli Odaklanma</span>
          </div>
        </div>

        {/* Card 3: Seri (Streak) */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between min-h-[130px]`}>
          <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-tight">Seri (Streak)</div>
          <div className="text-3xl font-black text-pink-500 mt-2 flex items-center gap-2">
            🔥 {appState.profile.streak} GÜN
          </div>
          <div className="flex gap-1.5 mt-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${i < appState.profile.streak ? 'bg-pink-500' : 'bg-pink-100 dark:bg-zinc-800'}`} 
              />
            ))}
          </div>
        </div>

        {/* Card 4: Genel İlerleme */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between min-h-[130px]`}>
          <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-tight">Genel İlerleme</div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
            %{overallProgressPercent}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-3 block truncate">
            {completedTopics} / {appState.topics.length} Konu Tamamlandı
          </div>
        </div>

      </div>

      {/* Goals and Programs Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Goals Checklist */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                Günlük Kişisel Hedefler
              </h3>
              <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-bold">
                {appState.dailyGoals.filter(g => g.completed).length} / {appState.dailyGoals.length}
              </span>
            </div>

            {/* Daily Goal Input */}
            <form onSubmit={handleAddGoalSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Örn. Matematik yaprak test çöz"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                    : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                }`}
              />
              <button
                type="submit"
                className={`p-2.5 text-white rounded-xl ${theme.primary} ${theme.primaryHover} cursor-pointer shadow-sm`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            {/* Checklist items */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              <AnimatePresence>
                {appState.dailyGoals.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-2">
                    <Target className="w-8 h-8 opacity-45" />
                    Henüz günlük hedef eklemedin. Bugün için bir hedef belirle!
                  </div>
                ) : (
                  appState.dailyGoals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`flex justify-between items-center p-3 rounded-xl border group transition-all duration-200 ${
                        goal.completed 
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-400 line-through' 
                          : 'bg-slate-500/5 border-slate-200/10 hover:border-slate-300'
                      }`}
                    >
                      <button 
                        type="button" 
                        onClick={() => onToggleDailyGoal(goal.id)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        {goal.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-rose-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{goal.text}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => onDeleteDailyGoal(goal.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Today's Study Program */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                Bugünkü Çalışma Programı
              </h3>
              <button 
                onClick={() => onSetActiveTab('planner')}
                className="text-xs font-semibold text-violet-500 hover:underline flex items-center"
              >
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {todaysProgram.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 opacity-45" />
                  Bugün için planlanmış ders bulunmuyor. Program ekranından ders ekleyebilirsin!
                </div>
              ) : (
                todaysProgram.map((item) => {
                  const subDetails = getSubjectNameAndColor(item.subjectId);
                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        item.completed 
                          ? 'bg-slate-100/45 dark:bg-zinc-800/40 border-slate-200 opacity-70' 
                          : 'bg-white dark:bg-zinc-900 border-slate-200/70 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Circle indicating subject color */}
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0" 
                          style={{ backgroundColor: subDetails.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold" style={{ color: subDetails.color }}>
                              {subDetails.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                              {item.timeStart} - {item.timeEnd}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-100 mt-0.5 line-clamp-1">
                            {getTopicName(item.topicId)}
                          </p>
                          <span className="text-[11px] text-slate-400">Hedef: {item.questionGoal} Soru</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleProgramItem(item.id)}
                        className={`p-1.5 rounded-full border transition-all ${
                          item.completed 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'text-slate-400 hover:text-emerald-500 border-slate-200/70 hover:border-emerald-500'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Gamification Missions Section */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Günlük Görevler ve Ödüller
          </h3>
          <span className="text-xs text-slate-400 font-bold">Her Gün Yenilenir</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appState.dailyMissions.map((mission) => {
            const completedPercent = Math.min(100, Math.round((mission.currentValue / mission.targetValue) * 100));
            return (
              <div 
                key={mission.id}
                className={`p-4 rounded-2xl border ${
                  mission.completed 
                    ? 'bg-emerald-500/5 border-emerald-500/10' 
                    : 'bg-white dark:bg-zinc-900 border-slate-100 shadow-sm'
                } flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      mission.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {mission.completed ? 'TAMAMLANDI' : 'GÖREV'}
                    </span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-100 mt-2">
                      {mission.text}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-yellow-500 shrink-0 bg-yellow-500/10 px-2 py-1 rounded-lg">
                    +{mission.xpReward} XP
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 font-mono">
                    <span>İlerleme</span>
                    <span>{mission.currentValue} / {mission.targetValue}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        mission.completed ? 'bg-emerald-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${completedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
