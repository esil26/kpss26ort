/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeType } from '../types';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  accent: string;
  border: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  accentGradient: string;
  tabActive: string;
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  sakura: {
    id: 'sakura',
    name: 'Sakura (Professional Polish 🌸)',
    bg: 'bg-[#FDFCFD]',
    cardBg: 'bg-white/95 border border-[#F3E8FF] shadow-sm backdrop-blur-md',
    text: 'text-slate-800 dark:text-slate-100',
    textMuted: 'text-slate-400 dark:text-slate-500',
    primary: 'bg-pink-500',
    primaryHover: 'hover:bg-pink-600 active:bg-pink-700',
    accent: 'pink-500',
    border: 'border-[#F3E8FF]',
    ring: 'focus:ring-pink-400',
    badgeBg: 'bg-pink-50/80 border border-pink-100/60',
    badgeText: 'text-pink-600',
    gradient: 'from-[#E9D5FF] via-[#FBCFE8] to-pink-300',
    accentGradient: 'from-[#FAF5FF] to-[#FFF1F2] border border-pink-100/60',
    tabActive: 'bg-pink-50 text-pink-600 border-pink-200'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender (Lavanta Esintisi 🪻)',
    bg: 'bg-[#FCFDFD]',
    cardBg: 'bg-white/95 border border-[#E9D5FF] shadow-sm backdrop-blur-md',
    text: 'text-slate-800 dark:text-slate-100',
    textMuted: 'text-slate-400 dark:text-slate-500',
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600 active:bg-purple-700',
    accent: 'purple-500',
    border: 'border-[#E9D5FF]',
    ring: 'focus:ring-purple-400',
    badgeBg: 'bg-purple-50/80 border border-purple-100/60',
    badgeText: 'text-purple-600',
    gradient: 'from-[#D8B4FE] via-[#C084FC] to-purple-300',
    accentGradient: 'from-[#FAF5FF] to-[#F3E8FF] border border-purple-100/60',
    tabActive: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Beyaz ☕',
    bg: 'bg-slate-50/60',
    cardBg: 'bg-white border border-slate-200/80 shadow-sm',
    text: 'text-slate-800 dark:text-slate-100',
    textMuted: 'text-slate-400 dark:text-slate-500',
    primary: 'bg-slate-900',
    primaryHover: 'hover:bg-slate-800 active:bg-slate-950',
    accent: 'slate-500',
    border: 'border-slate-200/70',
    ring: 'focus:ring-slate-400',
    badgeBg: 'bg-slate-50 border border-slate-200/60',
    badgeText: 'text-slate-800',
    gradient: 'from-slate-700 to-slate-900',
    accentGradient: 'from-slate-50 to-slate-100/50 border border-slate-200/60',
    tabActive: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  night: {
    id: 'night',
    name: 'Gece Modu 🌙',
    bg: 'bg-slate-950',
    cardBg: 'bg-slate-900/95 border border-slate-800/80 backdrop-blur-md shadow-2xl',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    primary: 'bg-pink-500',
    primaryHover: 'hover:bg-rose-600 active:bg-rose-700',
    accent: 'rose-400',
    border: 'border-slate-800',
    ring: 'focus:ring-rose-500',
    badgeBg: 'bg-slate-800 border border-slate-700',
    badgeText: 'text-rose-300',
    gradient: 'from-slate-800 via-slate-900 to-slate-950',
    accentGradient: 'from-rose-950/45 to-slate-900/40 border border-rose-500/10',
    tabActive: 'bg-slate-800 text-rose-300 border-slate-700'
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyber ⚡',
    bg: 'bg-zinc-950',
    cardBg: 'bg-zinc-900 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md',
    text: 'text-white',
    textMuted: 'text-zinc-400',
    primary: 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]',
    primaryHover: 'hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] active:bg-purple-700',
    accent: 'cyan-400',
    border: 'border-zinc-800',
    ring: 'focus:ring-purple-500',
    badgeBg: 'bg-zinc-800 border border-purple-500/30',
    badgeText: 'text-cyan-300 font-mono',
    gradient: 'from-purple-600 via-fuchsia-600 to-cyan-500',
    accentGradient: 'from-purple-950/50 to-zinc-900 border border-cyan-500/20',
    tabActive: 'bg-purple-950/80 text-cyan-300 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
  }
};
