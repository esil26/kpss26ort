/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Calendar, Timer, Target, ClipboardSignature, History, 
  FileText, BookMarked, Settings, LogOut, Menu, X, Sparkles, Award, User
} from 'lucide-react';
import { 
  AppState, ThemeType, TopicStatus, StudySession, ProgramItem, 
  ExamRecord, RevisionItem, NotebookNote, BookRecord, DailyGoal, DailyMission 
} from './types';
import { THEME_CONFIGS, ThemeConfig } from './lib/themeUtils';
import { DEFAULT_TOPICS, MOTIVATIONAL_QUOTES, ALL_BADGES, DEFAULT_MISSIONS, KPSS_SUBJECTS } from './data/kpssData';

// Sub-component imports
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import SubjectTracker from './components/SubjectTracker';
import StudyPlanner from './components/StudyPlanner';
import TimerPomodoro from './components/TimerPomodoro';
import QuestionTracker from './components/QuestionTracker';
import ExamsTracker from './components/ExamsTracker';
import RevisionSystem from './components/RevisionSystem';
import Notebook from './components/Notebook';
import BooksTracker from './components/BooksTracker';
import ProfileSettings from './components/ProfileSettings';

const STORAGE_KEY = 'esila_study_v1_state';

// Construct initial state based strictly on AppState interface from types.ts
const getInitialState = (): AppState => {
  const initialTopics = DEFAULT_TOPICS.map((t, index) => ({
    id: t.id,
    subjectId: t.subjectId,
    name: t.name,
    status: 'BASLANMADI' as TopicStatus,
    questionCount: 0,
    studyDuration: 0,
    lastStudied: null
  }));

  return {
    profile: {
      name: 'Esila Nisa',
      targetScore: 94.5,
      targetJob: 'Devlet Hava Meydanları İşletmesi (DHMİ) - Kadrolu Devlet Memurluğu 🌸',
      level: 1,
      xp: 150,
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyQuestionGoal: 200,
      dailyTimeGoal: 180, // in minutes
      unlockedBadges: ['badge_first_step'],
      personalGoals: [
        'KPSS 2026 Ortaöğretim sınavından en az 94.5 alarak atanmak',
        'Her gün aralıksız en az 200 soru çözmek',
        'Süreçte sakin kalıp zihnimi güçlü tutmak'
      ]
    },
    topics: initialTopics,
    studySessions: [
      {
        id: 'init-s1',
        date: new Date().toISOString().split('T')[0],
        subjectId: 'turkce',
        topicId: 'tr_1',
        duration: 30 * 60, // 30 mins in seconds
        questionsSolved: 40
      }
    ],
    dailyGoals: [
      {
        id: 'goal-1',
        date: new Date().toISOString().split('T')[0],
        text: '3 oturum Pomodoro tamamla',
        completed: false
      },
      {
        id: 'goal-2',
        date: new Date().toISOString().split('T')[0],
        text: 'Tarihten 60 soru çöz',
        completed: true
      }
    ],
    programItems: [
      {
        id: 'prog-1',
        dayOfWeek: new Date().getDay(), // today
        subjectId: 'turkce',
        topicId: 'tr_1',
        timeStart: '09:00',
        timeEnd: '10:00',
        questionGoal: 40,
        completed: true
      },
      {
        id: 'prog-2',
        dayOfWeek: new Date().getDay(),
        subjectId: 'matematik',
        topicId: 'mat_1',
        timeStart: '11:00',
        timeEnd: '12:30',
        questionGoal: 50,
        completed: false
      }
    ],
    exams: [
      {
        id: 'ex-1',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        examName: 'Pegem Türkiye Geneli 1. Deneme',
        turkceCorrect: 26,
        turkceIncorrect: 3,
        turkceBlank: 1,
        turkceNet: 25.25,
        matCorrect: 22,
        matIncorrect: 2,
        matBlank: 6,
        matNet: 21.5,
        gkCorrect: 47,
        gkIncorrect: 8,
        gkBlank: 5,
        gkNet: 45,
        totalCorrect: 95,
        totalIncorrect: 13,
        totalBlank: 12,
        totalNet: 91.75,
        estimatedScore: 88.26,
        notes: 'Geometriden eksiklerim var, Türkçe dil bilgisi netleri artmalı.'
      }
    ],
    revisions: [],
    notes: [
      {
        id: 'nt-1',
        title: 'Tarih - Divan Üyeleri Şifre',
        content: 'Sadrazam: Padişah vekilidir.\nKazasker: Kadı tayinlerini yapar, adalet ve eğitim işlerine bakar.\nDefterdar: Maliye bakanıdır.',
        date: new Date().toISOString().split('T')[0],
        tags: ['Tarih', 'Önemli', 'Şifreleme']
      }
    ],
    books: [
      {
        id: 'bk-1',
        title: 'Ezberbozan Türkçe Soru Bankası',
        author: 'Pegem Akademi',
        subjectId: 'turkce',
        totalQuestions: 600,
        solvedQuestions: 120,
        status: 'COZULUYOR'
      }
    ],
    dailyMissions: DEFAULT_MISSIONS(),
    currentTheme: 'sakura',
    isLoggedIn: false,
    userPin: '1202', // Default security PIN
    username: 'Esila Nisa'
  };
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isLoggedIn: false // lock on refresh
        };
      } catch (e) {
        return getInitialState();
      }
    }
    return getInitialState();
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeTheme = THEME_CONFIGS[state.currentTheme as ThemeType] || THEME_CONFIGS.sakura;

  // Dark/Light document classes
  useEffect(() => {
    const isDark = activeTheme.id === 'night' || activeTheme.id === 'neon';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme]);

  // XP progression mechanics
  const addXP = (amount: number) => {
    setState(prev => {
      let newXp = prev.profile.xp + amount;
      let newLevel = prev.profile.level;
      const xpNeeded = newLevel * 1000;

      if (newXp >= xpNeeded) {
        newXp = newXp - xpNeeded;
        newLevel += 1;
        setTimeout(() => setShowLevelUp(true), 400);
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          level: newLevel,
          xp: newXp
        }
      };
    });
  };

  // Auth Handler with customizable pin
  const handleLoginSuccess = (pin: string, username: string) => {
    setState(prev => ({
      ...prev,
      isLoggedIn: true,
      userPin: pin,
      username: username,
      profile: {
        ...prev.profile,
        name: username
      }
    }));
  };

  // 1. Dashboard Daily Goals Checklist Handlers
  const handleAddDailyGoal = (text: string) => {
    const newGoal: DailyGoal = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
      completed: false
    };
    setState(prev => ({
      ...prev,
      dailyGoals: [...prev.dailyGoals, newGoal]
    }));
    addXP(10);
  };

  const handleToggleDailyGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      dailyGoals: prev.dailyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    }));
    addXP(15);
  };

  const handleDeleteDailyGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      dailyGoals: prev.dailyGoals.filter(g => g.id !== id)
    }));
  };

  // 2. Subject tracker curriculum completed status change
  const handleUpdateTopicStatus = (topicId: string, status: TopicStatus) => {
    setState(prev => {
      const updatedTopics = prev.topics.map(t => {
        if (t.id === topicId) {
          if (status === 'TAMAMLANDI' && t.status !== 'TAMAMLANDI') {
            addXP(250); // Completed topic bonus
          }
          return { ...t, status };
        }
        return t;
      });

      // Spaced repetition item creation
      let updatedRevisions = [...prev.revisions];
      const targetTopic = prev.topics.find(t => t.id === topicId);
      
      if (status === 'TAMAMLANDI' && targetTopic && !prev.revisions.some(r => r.topicId === topicId)) {
        const today = new Date();
        const date1 = new Date();
        date1.setDate(today.getDate() + 1);
        const date7 = new Date();
        date7.setDate(today.getDate() + 7);
        const date30 = new Date();
        date30.setDate(today.getDate() + 30);

        const newRev: RevisionItem = {
          id: Math.random().toString(36).substring(2, 9),
          subjectId: targetTopic.subjectId,
          topicId: targetTopic.id,
          originalDate: today.toISOString().split('T')[0],
          revision1Date: date1.toISOString().split('T')[0],
          rev1Done: false,
          revision7Date: date7.toISOString().split('T')[0],
          rev7Done: false,
          revision30Date: date30.toISOString().split('T')[0],
          rev30Done: false
        };
        updatedRevisions.push(newRev);
      }

      return {
        ...prev,
        topics: updatedTopics,
        revisions: updatedRevisions
      };
    });
  };

  const handleUpdateTopicDetails = (topicId: string, status: TopicStatus, questionCount: number, duration: number) => {
    setState(prev => {
      const updatedTopics = prev.topics.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            status,
            questionCount: (t.questionCount || 0) + questionCount,
            studyDuration: (t.studyDuration || 0) + duration,
            lastStudied: new Date().toISOString().split('T')[0]
          };
        }
        return t;
      });
      return {
        ...prev,
        topics: updatedTopics
      };
    });
    addXP(100);
  };

  const handleAddCustomTopic = (subjectId: string, name: string) => {
    setState(prev => {
      const customId = `custom-${Math.random().toString(36).substring(2, 9)}`;
      const newTopic = {
        id: customId,
        subjectId,
        name,
        status: 'BASLANMADI' as TopicStatus,
        questionCount: 0,
        studyDuration: 0,
        lastStudied: null
      };
      return {
        ...prev,
        topics: [...prev.topics, newTopic]
      };
    });
    addXP(50);
  };

  // 3. Study Program (Weekly Scheduler) item changes
  const handleAddProgramItem = (item: Omit<ProgramItem, 'id' | 'completed'>) => {
    const newItem: ProgramItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      completed: false
    };
    setState(prev => ({
      ...prev,
      programItems: [...prev.programItems, newItem]
    }));
    addXP(40);
  };

  const handleToggleProgramItem = (id: string) => {
    setState(prev => {
      const updatedProg = prev.programItems.map(p => {
        if (p.id === id) {
          const finished = !p.completed;
          if (finished) addXP(75); // completion award
          return { ...p, completed: finished };
        }
        return p;
      });
      return {
        ...prev,
        programItems: updatedProg
      };
    });
  };

  const handleDeleteProgramItem = (id: string) => {
    setState(prev => ({
      ...prev,
      programItems: prev.programItems.filter(p => p.id !== id)
    }));
  };

  // 4. Pomodoro Study Session completion logging
  const handleLogStudySession = (subjectId: string, topicId: string, durationMinutes: number, questionsSolved: number) => {
    const session: StudySession = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      subjectId,
      topicId,
      duration: durationMinutes * 60, // in seconds
      questionsSolved
    };

    setState(prev => ({
      ...prev,
      studySessions: [...prev.studySessions, session]
    }));

    // Cascade update topic study logs
    handleUpdateTopicDetails(topicId, 'CALISILIYOR', questionsSolved, durationMinutes);
    addXP(150);
  };

  // Fast manual logging solved questions
  const handleLogQuestions = (subjectId: string, topicId: string, questionsCount: number) => {
    handleLogStudySession(subjectId, topicId, 0, questionsCount);
    addXP(20);
  };

  // 5. Exams Tracker logs
  const handleAddExamRecord = (exam: ExamRecord) => {
    setState(prev => ({
      ...prev,
      exams: [...prev.exams, exam]
    }));
    addXP(350);
  };

  const handleDeleteExamRecord = (id: string) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.filter(e => e.id !== id)
    }));
  };

  // 6. Spaced repetition completions
  const handleCompleteRevisionStep = (itemId: string, step: 'rev1' | 'rev7' | 'rev30') => {
    setState(prev => {
      const updatedRevs = prev.revisions.map(rev => {
        if (rev.id === itemId) {
          return {
            ...rev,
            [`${step}Done`]: true
          };
        }
        return rev;
      });
      return {
        ...prev,
        revisions: updatedRevs
      };
    });
    addXP(50);
  };

  // 7. Notebook card managers
  const handleAddNote = (note: Omit<NotebookNote, 'id' | 'date'>) => {
    const newNote: NotebookNote = {
      ...note,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    addXP(30);
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  // 8. Prep book solutions
  const handleAddBook = (book: Omit<BookRecord, 'id' | 'solvedQuestions' | 'status'>) => {
    const newBook: BookRecord = {
      ...book,
      id: Math.random().toString(36).substring(2, 9),
      solvedQuestions: 0,
      status: 'BASLANMADI'
    };
    setState(prev => ({
      ...prev,
      books: [...prev.books, newBook]
    }));
    addXP(45);
  };

  const handleUpdateBookProgress = (id: string, solvedQuestions: number) => {
    setState(prev => {
      const updatedBooks = prev.books.map(b => {
        if (b.id === id) {
          const status = solvedQuestions >= b.totalQuestions 
            ? 'TAMAMLANDI' 
            : solvedQuestions > 0 ? 'COZULUYOR' : 'BASLANMADI';
          
          if (status === 'TAMAMLANDI' && b.status !== 'TAMAMLANDI') {
            addXP(200);
          }
          return {
            ...b,
            solvedQuestions,
            status
          };
        }
        return b;
      });
      return {
        ...prev,
        books: updatedBooks
      };
    });
  };

  const handleDeleteBook = (id: string) => {
    setState(prev => ({
      ...prev,
      books: prev.books.filter(b => b.id !== id)
    }));
  };

  // 9. Profile Settings
  const handleUpdateProfile = (name: string, targetScore: number, targetJob: string, personalGoals: string[]) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name,
        targetScore,
        targetJob,
        personalGoals
      }
    }));
  };

  const handleSelectTheme = (themeId: ThemeType) => {
    setState(prev => ({
      ...prev,
      currentTheme: themeId
    }));
  };

  const handleResetDatabase = () => {
    setState(getInitialState());
  };

  const handleImportBackup = (backup: AppState) => {
    setState(backup);
  };

  const handleLogout = () => {
    setState(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    setActiveTab('dashboard');
  };

  // Shell Tabs Navigation configuration
  const TAB_ITEMS = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'curriculum', label: 'Müfredat Takip', icon: BookOpen },
    { id: 'planner', label: 'Çalışma Programı', icon: Calendar },
    { id: 'pomodoro', label: 'Pomodoro Sayaç', icon: Timer },
    { id: 'questions', label: 'Soru Takibi', icon: Target },
    { id: 'exams', label: 'Deneme Analiz', icon: ClipboardSignature },
    { id: 'revision', label: 'Aralıklı Tekrar', icon: History },
    { id: 'notebook', label: 'Ders Notlarım', icon: FileText },
    { id: 'books', label: 'Kaynak Kitaplar', icon: BookMarked },
    { id: 'settings', label: 'Profil & Ayarlar', icon: Settings }
  ];

  // PIN Protection Screen
  if (!state.isLoggedIn) {
    return (
      <LoginScreen 
        theme={activeTheme} 
        savedPin={state.userPin}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-800 dark:text-slate-100 flex transition-colors duration-300 ${activeTheme.bg}`}>
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP ONLY */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#F3E8FF] dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 select-none z-10">
        
        {/* Logo area */}
        <div className="p-6 border-b border-[#F3E8FF] dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#E9D5FF] to-[#FBCFE8] dark:from-purple-950 dark:to-pink-950 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 font-black text-xl shadow-sm italic shrink-0">
            E
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-tight text-slate-800 dark:text-slate-100 italic">Esila Study</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">KPSS Ortaöğretim</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {TAB_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-extrabold rounded-xl cursor-pointer transition-all ${
                  isSel 
                    ? 'bg-pink-50 text-pink-600 border border-pink-100 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900/30 shadow-sm' 
                    : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile summary & Logout (Gamification Card) */}
        <div className="p-4 border-t border-[#F3E8FF] dark:border-zinc-800 space-y-4">
          <div className={`bg-gradient-to-br ${activeTheme.accentGradient} p-4.5 rounded-2xl border shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${activeTheme.badgeText}`}>Seviye {state.profile.level}</span>
              <button 
                onClick={() => setActiveTab('settings')}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 italic underline cursor-pointer bg-transparent border-0 p-0"
              >
                Rozetlerim
              </button>
            </div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block truncate">
              {state.profile.name} • <span className="font-mono text-xs text-slate-500">{state.profile.xp} XP</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-white dark:bg-zinc-900 h-2 rounded-full mt-2.5 overflow-hidden border border-pink-50 dark:border-zinc-800">
              <div 
                className={`bg-gradient-to-r ${activeTheme.gradient} h-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.round((state.profile.xp / (state.profile.level * 1000)) * 100))}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-400 mt-1.5 text-center font-medium">Sıradaki Seviye: Level {state.profile.level + 1} 🎯</div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border border-red-100 dark:border-red-950/30 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            PIN Ekranını Kilitle
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION DRAWER */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white dark:bg-zinc-950 border-b flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 bg-gradient-to-tr ${activeTheme.gradient} text-white rounded-lg`}>
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="text-sm font-black tracking-tight">Esila Study</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border rounded-xl text-slate-500 hover:text-slate-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-16 bottom-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r z-50 flex flex-col justify-between p-4"
            >
              <nav className="space-y-1.5 overflow-y-auto">
                {TAB_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSel = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-extrabold rounded-2xl cursor-pointer ${
                        isSel 
                          ? `${activeTheme.primary} text-white shadow-sm` 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="border-t pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5 px-2">
                  <div className="p-1.5 bg-rose-100 text-rose-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">{state.profile.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Seviye {state.profile.level}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center font-bold text-xs text-red-500 border border-red-200/50 rounded-xl"
                >
                  Kilitle / Çıkış Yap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE / CONTENT STAGE */}
      <main className="flex-1 lg:max-w-7xl lg:mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Transition wrapper */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  appState={state} 
                  theme={activeTheme} 
                  onAddDailyGoal={handleAddDailyGoal}
                  onToggleDailyGoal={handleToggleDailyGoal}
                  onDeleteDailyGoal={handleDeleteDailyGoal}
                  onToggleProgramItem={handleToggleProgramItem}
                  onSetActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'curriculum' && (
                <SubjectTracker 
                  appState={state} 
                  theme={activeTheme} 
                  onUpdateTopicStatus={handleUpdateTopicStatus}
                  onUpdateTopicDetails={handleUpdateTopicDetails}
                  onAddCustomTopic={handleAddCustomTopic}
                />
              )}
              {activeTab === 'planner' && (
                <StudyPlanner 
                  appState={state} 
                  theme={activeTheme} 
                  onAddProgramItem={handleAddProgramItem}
                  onToggleProgramItem={handleToggleProgramItem}
                  onDeleteProgramItem={handleDeleteProgramItem}
                />
              )}
              {activeTab === 'pomodoro' && (
                <TimerPomodoro 
                  appState={state} 
                  theme={activeTheme} 
                  onLogStudySession={handleLogStudySession}
                />
              )}
              {activeTab === 'questions' && (
                <QuestionTracker 
                  appState={state} 
                  theme={activeTheme} 
                  onLogQuestions={handleLogQuestions}
                />
              )}
              {activeTab === 'exams' && (
                <ExamsTracker 
                  appState={state} 
                  theme={activeTheme} 
                  onAddExamRecord={handleAddExamRecord}
                  onDeleteExamRecord={handleDeleteExamRecord}
                />
              )}
              {activeTab === 'revision' && (
                <RevisionSystem 
                  appState={state} 
                  theme={activeTheme} 
                  onCompleteRevisionStep={handleCompleteRevisionStep}
                />
              )}
              {activeTab === 'notebook' && (
                <Notebook 
                  appState={state} 
                  theme={activeTheme} 
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
              {activeTab === 'books' && (
                <BooksTracker 
                  appState={state} 
                  theme={activeTheme} 
                  onAddBook={handleAddBook}
                  onUpdateBookProgress={handleUpdateBookProgress}
                  onDeleteBook={handleDeleteBook}
                />
              )}
              {activeTab === 'settings' && (
                <ProfileSettings 
                  appState={state} 
                  theme={activeTheme} 
                  onUpdateProfile={handleUpdateProfile}
                  onSelectTheme={handleSelectTheme}
                  onResetDatabase={handleResetDatabase}
                  onImportBackup={handleImportBackup}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* 4. LEVEL UP GLOBAL CONGRATULATIONS MODAL */}
      <AnimatePresence>
        {showLevelUp && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border shadow-2xl text-center max-w-sm relative overflow-hidden"
            >
              {/* Confetti simulation rays background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-violet-500/5 to-amber-500/10" />

              <div className="relative z-10 space-y-4">
                <div className="p-4 bg-yellow-400 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <Award className="w-12 h-12" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">SEVİYE ATLADIN! 🎉</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Tebrikler Esila! KPSS Ortaöğretim hazırlık serüveninde gösterdiğin azim ve çalışma sayesinde artık daha güçlüsün.
                </p>
                
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">YENİ SEVİYENİZ</span>
                  <span className="text-4xl font-black text-rose-500 font-mono block mt-1">Level {state.profile.level}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLevelUp(false)}
                  className={`w-full py-3 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md ${activeTheme.primary}`}
                >
                  Tamam, Odaklanmaya Devam! ⭐
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
