/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Award, CheckCircle, 
  Sparkles, Coffee, AlertCircle, Save, X, Moon, Flame, Wind
} from 'lucide-react';
import { AppState, TopicStatus } from '../types';
import { ThemeConfig } from '../lib/themeUtils';
import { KPSS_SUBJECTS } from '../data/kpssData';

interface TimerPomodoroProps {
  appState: AppState;
  theme: ThemeConfig;
  onLogStudySession: (subjectId: string, topicId: string, durationMinutes: number, questionsSolved: number) => void;
}

type Mode = 'WORK' | 'SHORT' | 'LONG';
type SoundType = 'NONE' | 'RAIN' | 'DRONE' | 'WIND';

export default function TimerPomodoro({
  appState,
  theme,
  onLogStudySession
}: TimerPomodoroProps) {
  // Timer states
  const [mode, setMode] = useState<Mode>('WORK');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  
  // Ambient Sound states
  const [sound, setSound] = useState<SoundType>('NONE');
  const [volume, setVolume] = useState(0.4);

  // Post Session Log modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [loggedSubjectId, setLoggedSubjectId] = useState('turkce');
  const [loggedTopicId, setLoggedTopicId] = useState('');
  const [loggedQuestions, setLoggedQuestions] = useState(0);
  const [lastCompletedMinutes, setLastCompletedMinutes] = useState(25);

  const activeSubjectTopics = appState.topics.filter(t => t.subjectId === loggedSubjectId);

  // Audio Context Ref for real browser synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ noiseNode?: AudioNode; gainNode?: GainNode; osc1?: OscillatorNode; osc2?: OscillatorNode } | null>(null);

  // Auto set first topic when logging subject changes
  useEffect(() => {
    if (activeSubjectTopics.length > 0) {
      setLoggedTopicId(activeSubjectTopics[0].id);
    } else {
      setLoggedTopicId('');
    }
  }, [loggedSubjectId]);

  // Mode configurations
  const MODE_CONFIGS: Record<Mode, { label: string; minutes: number; icon: any; color: string; border: string }> = {
    WORK: { label: 'Odaklanma', minutes: 25, icon: Timer, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200' },
    SHORT: { label: 'Kısa Mola', minutes: 5, icon: Coffee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200' },
    LONG: { label: 'Uzun Mola', minutes: 15, icon: Coffee, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200' }
  };

  // Sound Engine setup & controls
  const startSynthSound = (type: SoundType) => {
    stopSynthSound();
    if (type === 'NONE') return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const nodes: any = { gainNode: masterGain };

      if (type === 'RAIN' || type === 'WIND') {
        // Generate white noise for Rain or Wind
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass/Bandpass filter to shape white noise
        const filter = ctx.createBiquadFilter();
        if (type === 'RAIN') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
        } else {
          // Wind has modulated bandpass filter
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(400, ctx.currentTime);
          filter.Q.setValueAtTime(3.0, ctx.currentTime);

          // LFO to modulate wind frequency
          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // very slow
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(200, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
          nodes.windLfo = lfo;
        }

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        nodes.noiseNode = whiteNoise;
        nodes.filterNode = filter;
      } else if (type === 'DRONE') {
        // Binaural focus drone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(114, ctx.currentTime); // Binaural beat 4Hz

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        nodes.osc1 = osc1;
        nodes.osc2 = osc2;
        nodes.filterNode = filter;
      }

      audioNodesRef.current = nodes;
    } catch (e) {
      console.warn("Audio Context could not start:", e);
    }
  };

  const stopSynthSound = () => {
    if (audioNodesRef.current) {
      const { noiseNode, osc1, osc2, windLfo } = audioNodesRef.current as any;
      try {
        if (noiseNode) noiseNode.stop();
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (windLfo) windLfo.stop();
      } catch (e) {}
      audioNodesRef.current = null;
    }
  };

  useEffect(() => {
    if (sound !== 'NONE') {
      startSynthSound(sound);
    } else {
      stopSynthSound();
    }
    return () => stopSynthSound();
  }, [sound]);

  useEffect(() => {
    if (audioNodesRef.current && audioNodesRef.current.gainNode) {
      audioNodesRef.current.gainNode.gain.setValueAtTime(volume * 0.5, audioCtxRef.current?.currentTime || 0);
    }
  }, [volume]);

  // Main Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionCompletion();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Sync mode timer changes
  const switchMode = (newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIGS[newMode].minutes * 60);
  };

  const handleSessionCompletion = () => {
    // Play sound notification
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 chord sound
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}

    if (mode === 'WORK') {
      setLastCompletedMinutes(MODE_CONFIGS.WORK.minutes);
      setShowLogModal(true);
    } else {
      // Just notify break is over
      alert("Molanız tamamlandı! Çalışma zamanı.");
      switchMode('WORK');
    }
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogStudySession(loggedSubjectId, loggedTopicId, lastCompletedMinutes, loggedQuestions);
    setShowLogModal(false);
    // Auto reset to Break mode
    switchMode('SHORT');
  };

  // Formatter for MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // SVG Progress circle values
  const totalSeconds = MODE_CONFIGS[mode].minutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const strokeDashoffset = 502 - (502 * progressPercent) / 100;

  return (
    <div className="space-y-6 animate-fadeIn" id="pomodoro_tab">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Timer className="w-6 h-6 text-rose-500" />
          Pomodoro Sayaç & Odaklanma Alanı
        </h2>
        <p className="text-sm mt-1 text-slate-400 font-medium">
          25 dakika odaklanarak çalış, 5 dakika mola ver. Konsantrasyonunu koru ve rekorları kır!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Timer Display */}
        <div className={`lg:col-span-2 p-8 rounded-3xl ${theme.cardBg} border shadow-md flex flex-col items-center justify-center min-h-[420px]`}>
          
          {/* Preset Buttons */}
          <div className="flex gap-2.5 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl mb-8 border border-slate-200/50">
            {(Object.keys(MODE_CONFIGS) as Mode[]).map((mKey) => {
              const cfg = MODE_CONFIGS[mKey];
              const isSel = mode === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => switchMode(mKey)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSel 
                      ? 'bg-white dark:bg-zinc-900 shadow-sm text-slate-800 dark:text-slate-100' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Large Clock Sphere */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="128" cy="128" r="80" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeWidth="6" />
              <motion.circle 
                cx="128" 
                cy="128" 
                r="80" 
                fill="transparent" 
                stroke="currentColor" 
                className="text-rose-500" 
                strokeWidth="7" 
                strokeDasharray={502} 
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>

            {/* Counter content */}
            <div className="text-center z-10">
              <span className="text-4xl md:text-5xl font-black font-mono tracking-tight tabular-nums block">
                {formatTime(timeLeft)}
              </span>
              <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 px-3 py-0.5 rounded-full inline-block ${MODE_CONFIGS[mode].color}`}>
                {MODE_CONFIGS[mode].label}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4.5 mt-8 items-center">
            
            {/* Reset button */}
            <button
              onClick={() => switchMode(mode)}
              className="p-3.5 rounded-2xl border text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              title="Sıfırla"
            >
              <RotateCcw className="w-5.5 h-5.5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-5 rounded-full text-white cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isActive ? 'bg-amber-500 hover:bg-amber-600' : theme.primary
              }`}
            >
              {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>

            {/* Volume controls quick mute toggle */}
            <button
              onClick={() => {
                if (sound !== 'NONE') setSound('NONE');
                else setSound('RAIN');
              }}
              className="p-3.5 rounded-2xl border text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              title={sound !== 'NONE' ? 'Sesi Kapat' : 'Yağmur Sesi Aç'}
            >
              {sound !== 'NONE' ? <Volume2 className="w-5.5 h-5.5 text-rose-500" /> : <VolumeX className="w-5.5 h-5.5" />}
            </button>

          </div>

        </div>

        {/* Ambient Sound Module */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm flex flex-col justify-between`}>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3 mb-4">
              <Volume2 className="w-5 h-5 text-violet-500" />
              Odaklanma Sesleri
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
              Uygulamaya entegre Web Audio sentezleyicimiz ile zihnini sakinleştiren sesler üret ve arka planda dinle.
            </p>

            {/* Audio Presets */}
            <div className="space-y-3">
              {[
                { id: 'NONE', label: 'Sessiz', desc: 'Sadece sayaç ve zihniniz.', icon: VolumeX },
                { id: 'RAIN', label: 'Ilık Yağmur', desc: 'Synthesized statik yağmur damlaları.', icon: Moon },
                { id: 'DRONE', label: 'Binaural Drone', desc: 'Derin odak dalgaları (4Hz beat).', icon: Wind },
                { id: 'WIND', label: 'Hafif Rüzgar', desc: 'Dinlendirici rüzgar uğultusu.', icon: Flame }
              ].map((preset) => {
                const isSel = sound === preset.id;
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSound(preset.id as SoundType)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSel 
                        ? 'border-violet-500/40 bg-violet-500/5 shadow-sm' 
                        : 'border-slate-100 bg-white dark:bg-zinc-900 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isSel ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isSel ? 'text-violet-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{preset.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume slider */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Ses Şiddeti</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-rose-500 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Post Session Logging Overlay Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md ${theme.cardBg} rounded-3xl p-6.5 border shadow-2xl relative overflow-hidden`}
            >
              {/* Top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse" />
              
              <div className="text-center mb-6">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-700 dark:text-slate-100">Tebrikler Esila! 🎉</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Harika bir {lastCompletedMinutes} dakikalık odaklanma serisini başarıyla tamamladın.
                </p>
                <span className="inline-block bg-yellow-400/10 text-yellow-500 font-extrabold text-xs px-3.5 py-1 rounded-full mt-3 border border-yellow-500/10">
                  +100 XP KAZANILDI ⭐
                </span>
              </div>

              {/* Form to link to a Subject / Topic */}
              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Hangi Dersi Çalıştın?
                  </label>
                  <select
                    value={loggedSubjectId}
                    onChange={(e) => setLoggedSubjectId(e.target.value)}
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
                    Hangi Konuydu?
                  </label>
                  <select
                    value={loggedTopicId}
                    onChange={(e) => setLoggedTopicId(e.target.value)}
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
                    Bu Oturumda Çözülen Soru Sayısı (İsteğe Bağlı)
                  </label>
                  <input
                    type="number"
                    value={loggedQuestions}
                    onChange={(e) => setLoggedQuestions(Math.max(0, Number(e.target.value)))}
                    placeholder="Örn. 30"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme.id === 'night' || theme.id === 'neon'
                        ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                    }`}
                  />
                </div>

                {/* Submit button */}
                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogModal(false);
                      switchMode('SHORT'); // skip logging, just start break
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-center"
                  >
                    Geç ve Molaya Başla
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-md flex justify-center items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Çalışmayı Günlüğe Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
