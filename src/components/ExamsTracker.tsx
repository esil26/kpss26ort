/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardSignature, Plus, Calendar, TrendingUp, Award, Calculator, Trash2, 
  ChevronDown, ChevronUp, Save, CheckCircle, Info, FileSpreadsheet, X
} from 'lucide-react';
import { AppState, ExamRecord } from '../types';
import { ThemeConfig } from '../lib/themeUtils';

interface ExamsTrackerProps {
  appState: AppState;
  theme: ThemeConfig;
  onAddExamRecord: (exam: ExamRecord) => void;
  onDeleteExamRecord: (id: string) => void;
}

export default function ExamsTracker({
  appState,
  theme,
  onAddExamRecord,
  onDeleteExamRecord
}: ExamsTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  // Form states
  const [examName, setExamName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Türkçe (30 Soru)
  const [trCorrect, setTrCorrect] = useState(25);
  const [trIncorrect, setTrIncorrect] = useState(4);
  const [trBlank, setTrBlank] = useState(1);

  // Matematik (30 Soru)
  const [matCorrect, setMatCorrect] = useState(20);
  const [matIncorrect, setMatIncorrect] = useState(2);
  const [matBlank, setMatBlank] = useState(8);

  // Genel Kültür (60 Soru)
  const [gkCorrect, setGkCorrect] = useState(45);
  const [gkIncorrect, setGkIncorrect] = useState(10);
  const [gkBlank, setGkBlank] = useState(5);

  const calculateNet = (c: number, i: number) => {
    return Math.max(0, Number((c - i * 0.25).toFixed(2)));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    // Calculations
    const trNet = calculateNet(trCorrect, trIncorrect);
    const matNet = calculateNet(matCorrect, matIncorrect);
    const gkNet = calculateNet(gkCorrect, gkIncorrect);

    const totalCorrect = Number(trCorrect) + Number(matCorrect) + Number(gkCorrect);
    const totalIncorrect = Number(trIncorrect) + Number(matIncorrect) + Number(gkIncorrect);
    const totalBlank = Number(trBlank) + Number(matBlank) + Number(gkBlank);
    const totalNet = Number((trNet + matNet + gkNet).toFixed(2));

    // Realistic KPSS score calculator formula:
    // Base 50, standard deviation scaling: Score = 50 + Net * 0.417
    const estimatedScore = Math.min(100, Math.max(50, Number((50 + totalNet * 0.417).toFixed(3))));

    onAddExamRecord({
      id: Math.random().toString(36).substring(2, 9),
      date,
      examName: examName.trim(),
      turkceCorrect: Number(trCorrect),
      turkceIncorrect: Number(trIncorrect),
      turkceBlank: Number(trBlank),
      turkceNet: trNet,
      matCorrect: Number(matCorrect),
      matIncorrect: Number(matIncorrect),
      matBlank: Number(matBlank),
      matNet,
      gkCorrect: Number(gkCorrect),
      gkIncorrect: Number(gkIncorrect),
      gkBlank: Number(gkBlank),
      gkNet,
      totalCorrect,
      totalIncorrect,
      totalBlank,
      totalNet,
      estimatedScore,
      notes: notes.trim()
    });

    // Reset fields & close
    setExamName('');
    setNotes('');
    setShowAddForm(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedExamId(expandedExamId === id ? null : id);
  };

  // Sort exams by date descending
  const sortedExams = [...appState.exams].sort((a, b) => b.date.localeCompare(a.date));

  // Averages calculations
  const totalSavedExams = appState.exams.length;
  const avgNet = totalSavedExams > 0 
    ? (appState.exams.reduce((sum, e) => sum + e.totalNet, 0) / totalSavedExams).toFixed(2) 
    : '0.00';
  const highestScore = totalSavedExams > 0 
    ? Math.max(...appState.exams.map(e => e.estimatedScore)).toFixed(2) 
    : '0.00';

  // SVG Line Chart plotting scores chronologically
  const renderLineChart = () => {
    if (appState.exams.length < 2) {
      return (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400 text-center px-4 leading-normal">
          <Info className="w-5 h-5 text-rose-400 mr-2 shrink-0 animate-bounce" />
          Gelişim çizgini grafik üzerinde görmek için en az 2 deneme sınavı kaydetmelisin.
        </div>
      );
    }

    // Sort chronologically (oldest first)
    const chronoExams = [...appState.exams].sort((a, b) => a.date.localeCompare(b.date));
    const scores = chronoExams.map(e => e.estimatedScore);
    const minScore = Math.max(50, Math.min(...scores) - 5);
    const maxScore = Math.min(100, Math.max(...scores) + 5);
    const scoreRange = maxScore - minScore;

    const width = 500;
    const height = 150;
    const padding = 20;

    // Calculate coordinates
    const points = chronoExams.map((e, index) => {
      const x = padding + (index * (width - padding * 2)) / (chronoExams.length - 1);
      const y = height - padding - ((e.estimatedScore - minScore) * (height - padding * 2)) / scoreRange;
      return { x, y, score: e.estimatedScore, label: e.examName };
    });

    // Draw path string
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div className="relative pt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Gradient beneath the line */}
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="4" strokeWidth="0.5" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeDasharray="4" strokeWidth="0.5" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />

          {/* Area under curve */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#scoreAreaGrad)"
          />

          {/* Glowing Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#examLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <linearGradient id="examLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* Coordinates points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#ffffff"
                stroke="#ec4899"
                strokeWidth="2.5"
                className="transition-all hover:r-6"
              />
              {/* Tooltip on hover */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="8"
                fontWeight="black"
                fill="#64748b"
                className="opacity-0 group-hover:opacity-100 transition-opacity font-mono"
              >
                {p.score.toFixed(1)} P.
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="exams_tab">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ClipboardSignature className="w-6 h-6 text-rose-500" />
            Deneme Sınavları & Net Analizi
          </h2>
          <p className="text-sm mt-1 text-slate-400 font-medium">
            Çözdüğün deneme sınavlarını kaydet, ders ders doğru/yanlış analizini ve tahmini ÖSYM puanını gör.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover} self-start`}
        >
          <Plus className="w-4.5 h-4.5" />
          Deneme Sınavı Ekle
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Toplam Deneme */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-4`}>
          <div className="p-3 bg-rose-100 dark:bg-rose-950/50 text-rose-500 rounded-2xl">
            <ClipboardSignature className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Toplam Sınav</span>
            <span className="text-2xl font-black">{totalSavedExams} Deneme</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Kaydedilen Tarihçe</span>
          </div>
        </div>

        {/* Ortalama Net */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-4`}>
          <div className="p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-500 rounded-2xl">
            <Calculator className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Ortalama Net</span>
            <span className="text-2xl font-black">{avgNet} Net</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">120 Soru Üzerinden</span>
          </div>
        </div>

        {/* En Yüksek Puan */}
        <div className={`p-5 rounded-3xl ${theme.cardBg} border shadow-sm flex items-center gap-4`}>
          <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-500 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">En Yüksek Tahmini Puan</span>
            <span className="text-2xl font-black">{highestScore} Puan</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">KPSS 2026 Eşdeğeri</span>
          </div>
        </div>

      </div>

      {/* Add Exam Form Panel */}
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
                <Calculator className="w-5 h-5 text-rose-500" />
                Yeni Deneme Sınavı Verisi Girin
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              {/* Exam Info row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Yayın / Deneme Sınavı Adı
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="Örn. Pegem Türkiye Geneli 1"
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
                    Çözülme Tarihi
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Course-wise correct-incorrect row inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t pt-4">
                
                {/* Türkçe */}
                <div className="p-4.5 rounded-2xl bg-pink-500/5 border border-pink-200/20 space-y-3.5">
                  <h4 className="text-sm font-extrabold text-pink-500 border-b pb-1.5 flex justify-between">
                    <span>Türkçe</span>
                    <span className="text-[10px] text-slate-400 font-medium">30 Soru</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doğru</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={trCorrect}
                        onChange={(e) => setTrCorrect(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Yanlış</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={trIncorrect}
                        onChange={(e) => setTrIncorrect(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Boş</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={trBlank}
                        onChange={(e) => setTrBlank(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Matematik */}
                <div className="p-4.5 rounded-2xl bg-violet-500/5 border border-violet-200/20 space-y-3.5">
                  <h4 className="text-sm font-extrabold text-violet-500 border-b pb-1.5 flex justify-between">
                    <span>Matematik</span>
                    <span className="text-[10px] text-slate-400 font-medium">30 Soru</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doğru</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={matCorrect}
                        onChange={(e) => setMatCorrect(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Yanlış</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={matIncorrect}
                        onChange={(e) => setMatIncorrect(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Boş</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={matBlank}
                        onChange={(e) => setMatBlank(Math.max(0, Math.min(30, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Genel Kültür */}
                <div className="p-4.5 rounded-2xl bg-amber-500/5 border border-amber-200/20 space-y-3.5">
                  <h4 className="text-sm font-extrabold text-amber-500 border-b pb-1.5 flex justify-between">
                    <span>Genel Kültür</span>
                    <span className="text-[10px] text-slate-400 font-medium">60 Soru</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doğru</span>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={gkCorrect}
                        onChange={(e) => setGkCorrect(Math.max(0, Math.min(60, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Yanlış</span>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={gkIncorrect}
                        onChange={(e) => setGkIncorrect(Math.max(0, Math.min(60, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Boş</span>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={gkBlank}
                        onChange={(e) => setGkBlank(Math.max(0, Math.min(60, Number(e.target.value))))}
                        className="w-full p-2 border border-slate-200/70 text-center rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Sınav Notları / Eksik Konular
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Örn. Tarihte Kültür Medeniyet konusundan çok yanlışım çıktı, tekrar etmeliyim."
                  rows={2}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 border-t pt-4">
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
                  Deneme Kaydını Tamamla
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress trend line chart */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-4 mb-4">
          <TrendingUp className="w-5 h-5 text-rose-500" />
          Tahmini ÖSYM Puan Grafiği Gelişimi
        </h3>
        {renderLineChart()}
      </div>

      {/* Exams History List Table */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <div className="border-b pb-4 mb-5">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-violet-500" />
            Deneme Sınav Arşivi
          </h3>
        </div>

        <div className="space-y-3">
          {sortedExams.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center gap-2">
              <ClipboardSignature className="w-10 h-10 opacity-45" />
              Henüz kaydedilmiş deneme sınavı bulunmuyor.
            </div>
          ) : (
            sortedExams.map((exam) => {
              const isExpanded = expandedExamId === exam.id;
              return (
                <div 
                  key={exam.id} 
                  className="rounded-2xl border border-slate-100/90 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
                >
                  {/* Summary row */}
                  <div 
                    onClick={() => toggleExpand(exam.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-xl shrink-0">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                          {exam.examName}
                        </h4>
                        <span className="text-xs text-slate-400 block font-mono mt-0.5">{exam.date}</span>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 font-bold block">NET SKOR</span>
                        <span className="text-base font-black text-rose-500 font-mono">{exam.totalNet} Net</span>
                      </div>

                      <div className="text-center border-l pl-6">
                        <span className="text-[10px] text-slate-400 font-bold block">TAHMİNİ PUAN</span>
                        <span className="text-base font-black text-emerald-500 font-mono">{exam.estimatedScore.toFixed(2)}</span>
                      </div>

                      <div className="text-slate-400 pl-3 hidden sm:block">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expand details view */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-500/5 border-t p-4.5 space-y-4"
                      >
                        {/* Course wise nets grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                          
                          {/* Türkçe */}
                          <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border space-y-2">
                            <span className="text-pink-500 block">Türkçe Net Analizi</span>
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>Doğru: {exam.turkceCorrect}</span>
                              <span>Yanlış: {exam.turkceIncorrect}</span>
                              <span>Boş: {exam.turkceBlank}</span>
                            </div>
                            <div className="text-right border-t pt-1.5 font-mono text-pink-500">
                              {exam.turkceNet} Net
                            </div>
                          </div>

                          {/* Matematik */}
                          <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border space-y-2">
                            <span className="text-violet-500 block">Matematik Net Analizi</span>
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>Doğru: {exam.matCorrect}</span>
                              <span>Yanlış: {exam.matIncorrect}</span>
                              <span>Boş: {exam.matBlank}</span>
                            </div>
                            <div className="text-right border-t pt-1.5 font-mono text-violet-500">
                              {exam.matNet} Net
                            </div>
                          </div>

                          {/* Genel Kültür */}
                          <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border space-y-2">
                            <span className="text-amber-500 block">Genel Kültür Net Analizi</span>
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>Doğru: {exam.gkCorrect}</span>
                              <span>Yanlış: {exam.gkIncorrect}</span>
                              <span>Boş: {exam.gkBlank}</span>
                            </div>
                            <div className="text-right border-t pt-1.5 font-mono text-amber-500">
                              {exam.gkNet} Net
                            </div>
                          </div>

                        </div>

                        {/* Exam Review Notes */}
                        {exam.notes && (
                          <div className="bg-white dark:bg-zinc-900 p-4.5 rounded-xl border text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Değerlendirme Notu</span>
                            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                              "{exam.notes}"
                            </p>
                          </div>
                        )}

                        {/* Delete row */}
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => onDeleteExamRecord(exam.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Bu Sınavı Arşivden Sil
                          </button>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
