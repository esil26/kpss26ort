/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = 'sakura' | 'lavender' | 'minimal' | 'night' | 'neon';

export type TopicStatus = 'BASLANMADI' | 'CALISILIYOR' | 'TEKRAR_GEREKLI' | 'TAMAMLANDI' | 'COK_IYI_BILIYORUM';

export interface UserProfile {
  name: string;
  targetScore: number;
  targetJob: string;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  dailyQuestionGoal: number;
  dailyTimeGoal: number; // in minutes
  unlockedBadges: string[];
  personalGoals: string[];
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind hex or class color
  icon: string; // Lucide icon name
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  status: TopicStatus;
  questionCount: number;
  studyDuration: number; // in minutes
  lastStudied: string | null; // YYYY-MM-DD
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topicId: string;
  duration: number; // in seconds
  questionsSolved: number;
}

export interface DailyGoal {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  completed: boolean;
}

export interface ProgramItem {
  id: string;
  dayOfWeek: number; // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
  subjectId: string;
  topicId: string;
  timeStart: string; // HH:MM
  timeEnd: string; // HH:MM
  questionGoal: number;
  completed: boolean;
}

export interface ExamRecord {
  id: string;
  date: string; // YYYY-MM-DD
  examName: string;
  // Türkçe
  turkceCorrect: number;
  turkceIncorrect: number;
  turkceBlank: number;
  turkceNet: number;
  // Matematik
  matCorrect: number;
  matIncorrect: number;
  matBlank: number;
  matNet: number;
  // Genel Kültür (Tarih + Coğrafya + Vatandaşlık + Güncel)
  gkCorrect: number;
  gkIncorrect: number;
  gkBlank: number;
  gkNet: number;
  // Toplamlar
  totalCorrect: number;
  totalIncorrect: number;
  totalBlank: number;
  totalNet: number;
  estimatedScore: number;
  notes: string;
}

export interface RevisionItem {
  id: string;
  topicId: string;
  subjectId: string;
  originalDate: string; // YYYY-MM-DD
  revision1Date: string; // original + 1 day
  revision7Date: string; // original + 7 days
  revision30Date: string; // original + 30 days
  rev1Done: boolean;
  rev7Done: boolean;
  rev30Done: boolean;
}

export interface NotebookNote {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD HH:MM
  attachmentUrl?: string; // base64 or placeholder image
  tags: string[];
}

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  subjectId: string;
  totalQuestions: number;
  solvedQuestions: number;
  status: 'BASLANMADI' | 'COZULUYOR' | 'TAMAMLANDI';
}

export interface DailyMission {
  id: string;
  text: string;
  xpReward: number;
  targetValue: number;
  currentValue: number;
  type: 'STUDY_TIME' | 'QUESTIONS' | 'TOPIC_COMPLETE' | 'NOTE_TAKEN';
  completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedXp: number;
}

export interface AppState {
  profile: UserProfile;
  topics: Topic[];
  studySessions: StudySession[];
  dailyGoals: DailyGoal[];
  programItems: ProgramItem[];
  exams: ExamRecord[];
  revisions: RevisionItem[];
  notes: NotebookNote[];
  books: BookRecord[];
  dailyMissions: DailyMission[];
  currentTheme: ThemeType;
  isLoggedIn: boolean;
  userPin: string;
  username: string;
}
