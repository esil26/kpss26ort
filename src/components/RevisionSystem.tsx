/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  History, CheckCircle, CalendarDays, Zap, HelpCircle, ArrowRight, AlertCircle, 
  CheckCircle2, Clock, Check
} from 'lucide-react';
import { AppState, RevisionItem } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface RevisionSystemProps {
  appState: AppState;
  theme: ThemeConfig;
  onCompleteRevisionStep: (itemId: string, step: 'rev1' | 'rev7' | 'rev30') => void;
}

export default function RevisionSystem({
  appState,
  theme,
  onCompleteRevisionStep
}: RevisionSystemProps) {

  const getSubjectNameAndColor = (id: string) => {
    const subject = KPSS_SUBJECTS.find(s => s.id === id);
    return subject ? { name: subject.name, color: subject.color } : { name: 'Genel', color: '#64748b' };
  };

  const getTopicName = (id: string) => {
    const topic = appState.topics.find(t => t.id === id);
    return topic ? topic.name : 'Genel Konu';
  };

  // Date checkers
  const todayStr = new Date().toISOString().split('T')[0];

  // Separate revisions into Active (due today or overdue) vs Future (scheduled later)
  const getCategorizedRevisions = () => {
    const active: { item: RevisionItem; step: 'rev1' | 'rev7' | 'rev30'; dueDate: string }[] = [];
    const upcoming: { item: RevisionItem; step: 'rev1' | 'rev7' | 'rev30'; dueDate: string }[] = [];

    appState.revisions.forEach(rev => {
      // Step 1: 1 Day Revision
      if (!rev.rev1Done) {
        if (rev.revision1Date <= todayStr) {
          active.push({ item: rev, step: 'rev1', dueDate: rev.revision1Date });
        } else {
          upcoming.push({ item: rev, step: 'rev1', dueDate: rev.revision1Date });
        }
      }
      // Step 2: 7 Day Revision
      else if (!rev.rev7Done) {
        if (rev.revision7Date <= todayStr) {
          active.push({ item: rev, step: 'rev7', dueDate: rev.revision7Date });
        } else {
          upcoming.push({ item: rev, step: 'rev7', dueDate: rev.revision7Date });
        }
      }
      // Step 3: 30 Day Revision
      else if (!rev.rev30Done) {
        if (rev.revision30Date <= todayStr) {
          active.push({ item: rev, step: 'rev30', dueDate: rev.revision30Date });
        } else {
          upcoming.push({ item: rev, step: 'rev30', dueDate: rev.revision30Date });
        }
      }
    });

    return { active, upcoming };
  };

  const { active: activeRevs, upcoming: upcomingRevs } = getCategorizedRevisions();

  const STEP_LABELS = {
    rev1: '1 Günlük Tekrarı',
    rev7: '7 Günlük Tekrarı',
    rev30: '30 Günlük Tekrarı'
  };

  return (
    <div className="space-y-6" id="revision_tab">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-rose-500" />
          Aralıklı Tekrar Sistemi (Spaced Repetition)
        </h2>
        <p className="text-sm mt-1 text-slate-400 font-medium">
          Zihnimizin unutma eğrisine karşı (Ebbinghaus Eğrisi) 1 gün, 7 gün ve 30 gün sonra tekrarlar oluşturulur.
        </p>
      </div>

      {/* Info card */}
      <div className={`p-5 rounded-3xl bg-gradient-to-r from-violet-500/10 via-pink-500/5 to-rose-500/5 border relative overflow-hidden flex flex-col md:flex-row gap-4 items-center`}>
        <div className="p-3 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-2xl shrink-0">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Nasıl Çalışır?</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Müfredat panelinde tamamladığın (durumunu "Tamamlandı" yaptığın) her konu için otomatik olarak tekrar planlanır. 
            Tekrarları vaktinde yaparak bilgileri kalıcı belleğe aktarabilir ve her tekrarda **+50 XP** kazanabilirsin!
          </p>
        </div>
      </div>

      {/* Columns: Today's due vs Future scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Repetitions Due */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 animate-bounce" />
                Bugün Yapılacak Tekrarlar
              </h3>
              <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-500 px-2.5 py-0.5 rounded-full">
                {activeRevs.length} Yapılacak
              </span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {activeRevs.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center gap-2.5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <span className="font-bold text-slate-600 dark:text-slate-200">Harika! Bugün yapılacak tekrar kalmadı.</span>
                  <p className="text-[11px] leading-tight">Müfredatından yeni konuları tamamlayarak tekrar listeni besleyebilirsin.</p>
                </div>
              ) : (
                activeRevs.map(({ item, step, dueDate }) => {
                  const subDetails = getSubjectNameAndColor(item.subjectId);
                  const isOverdue = dueDate < todayStr;
                  return (
                    <div 
                      key={`${item.id}-${step}`}
                      className="p-3.5 rounded-2xl border border-slate-100/90 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Course visual color bubble */}
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" 
                          style={{ backgroundColor: subDetails.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold" style={{ color: subDetails.color }}>
                              {subDetails.name}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              isOverdue ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {isOverdue ? 'GECİKMİŞ' : 'BUGÜN'}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm mt-1 leading-snug line-clamp-1">
                            {getTopicName(item.topicId)}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {STEP_LABELS[step]} • Planlanan: {dueDate}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCompleteRevisionStep(item.id, step)}
                        className={`p-2 rounded-xl text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 shadow-md ${theme.primary} ${theme.primaryHover}`}
                      >
                        <Check className="w-4 h-4" />
                        Tekrar Et
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Future Repetitions Scheduled */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-violet-500" />
                Gelecekteki Tekrarlar
              </h3>
              <span className="text-xs font-mono font-bold bg-violet-100 dark:bg-zinc-800 text-violet-600 px-2.5 py-0.5 rounded-full">
                {upcomingRevs.length} Planlı
              </span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {upcomingRevs.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <HelpCircle className="w-10 h-10 opacity-45" />
                  Henüz gelecek tarihler için planlanmış bir tekrar listesi bulunmuyor.
                </div>
              ) : (
                upcomingRevs.map(({ item, step, dueDate }) => {
                  const subDetails = getSubjectNameAndColor(item.subjectId);
                  return (
                    <div 
                      key={`${item.id}-${step}`}
                      className="p-3.5 rounded-2xl border border-slate-100/95 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between gap-3 opacity-80"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0 mt-1" 
                          style={{ backgroundColor: subDetails.color }}
                        />
                        <div>
                          <span className="text-[10px] font-extrabold block" style={{ color: subDetails.color }}>
                            {subDetails.name}
                          </span>
                          <h4 className="font-bold text-xs mt-0.5 line-clamp-1">
                            {getTopicName(item.topicId)}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {STEP_LABELS[step]} • Tarih: {dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <ArrowRight className="w-4 h-4 text-slate-300" /> Bekliyor
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
