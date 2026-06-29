/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Sparkles, User, Flower2, Key, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { ThemeConfig } from '../lib/themeUtils';

interface LoginScreenProps {
  onLoginSuccess: (pin: string, username: string) => void;
  savedPin: string;
  theme: ThemeConfig;
}

export default function LoginScreen({ onLoginSuccess, savedPin, theme }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('Esila Nisa');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(!savedPin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (pin.length < 4) {
        setError('Lütfen en az 4 haneli güvenli bir şifre/PIN belirleyin.');
        return;
      }
      if (!username.trim()) {
        setError('Lütfen adınızı girin.');
        return;
      }
      onLoginSuccess(pin, username);
    } else {
      if (pin === savedPin) {
        onLoginSuccess(pin, username);
      } else {
        setError('Hatalı Şifre/PIN! Lütfen tekrar deneyin.');
        setPin('');
      }
    }
  };

  const handleQuickPin = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const hasBackgroundAnimation = theme.id === 'sakura' || theme.id === 'lavender' || theme.id === 'neon';

  return (
    <div id="login_container" className={`min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-500 ${theme.bg}`}>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-rose-200/40 to-pink-200/30 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-violet-200/40 to-indigo-200/30 blur-3xl pointer-events-none animate-pulse duration-[10000ms]" />

      {/* Falling Sakura Petals or Lavender Dots for Aesthetic touch */}
      {hasBackgroundAnimation && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                theme.id === 'sakura' 
                  ? 'bg-rose-200/40' 
                  : theme.id === 'lavender' 
                    ? 'bg-violet-200/40' 
                    : 'bg-purple-500/20'
              }`}
              style={{
                width: Math.random() * 20 + 8 + 'px',
                height: Math.random() * 20 + 8 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, 100, 200],
                x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
                rotate: [0, 180, 360],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`w-full max-w-md ${theme.cardBg} rounded-3xl shadow-xl p-8 z-10 border relative overflow-hidden`}
        id="login_card"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400" />
        
        {/* Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className={`p-4 rounded-2xl ${theme.id === 'night' || theme.id === 'neon' ? 'bg-zinc-800' : 'bg-rose-50'} mb-3 flex items-center justify-center`}
          >
            {theme.id === 'sakura' ? (
              <Flower2 className="w-10 h-10 text-rose-500" />
            ) : (
              <Sparkles className="w-10 h-10 text-violet-500 animate-pulse" />
            )}
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">
            Esila Study
          </h1>
          <p className="text-xs font-mono tracking-widest uppercase mt-1 text-slate-400">
            KPSS ORTAÖĞRETİM 2026
          </p>
          <div className="h-[2px] w-12 bg-rose-200 mt-3 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {isRegisterMode ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Özel Çalışma Alanına Hoş Geldin!
                  </h2>
                  <p className="text-xs text-slate-400">
                    Uygulamayı tamamen sana özel kılmak için adını ve şifreni oluştur.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    İsmin / Takma Adın
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        theme.id === 'night' || theme.id === 'neon'
                          ? 'bg-zinc-800 border-zinc-700 text-white focus:border-rose-400'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-300'
                      } focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium transition-all duration-300`}
                      placeholder="Örn. Esila"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-center space-y-2"
              >
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  Hoş Geldin, {username}!
                </h2>
                <p className="text-xs text-slate-400">
                  Esila Study hesabına giriş yapmak için PIN şifreni gir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIN Input Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1 text-left">
              {isRegisterMode ? 'Giriş Şifresi / PIN (4-6 Haneli)' : 'PIN Girin'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Key className="w-5 h-5" />
              </span>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                className={`w-full pl-11 pr-12 py-3.5 rounded-xl border ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800 border-zinc-700 text-white text-center focus:border-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-800 text-center focus:border-rose-300'
                } focus:outline-none focus:ring-2 focus:ring-rose-200 font-mono tracking-widest text-lg font-bold transition-all duration-300`}
                placeholder="••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs px-4.5 py-2.5 rounded-xl border border-red-100 dark:border-red-900/40 font-medium text-left flex items-start gap-2"
              >
                <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Number Pad for Quick Entry */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuickPin(String(num))}
                className={`py-3 rounded-xl font-bold text-lg border transition-all duration-200 ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800/50 border-zinc-800 text-slate-100 hover:bg-zinc-700/60 active:bg-zinc-800'
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className={`py-3 rounded-xl font-semibold text-xs border transition-all duration-200 uppercase ${
                theme.id === 'night' || theme.id === 'neon'
                  ? 'bg-zinc-800/30 border-zinc-800 text-slate-400 hover:bg-zinc-800'
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
              }`}
            >
              Temizle
            </button>
            <button
              type="button"
              onClick={() => handleQuickPin('0')}
              className={`py-3 rounded-xl font-bold text-lg border transition-all duration-200 ${
                theme.id === 'night' || theme.id === 'neon'
                  ? 'bg-zinc-800/50 border-zinc-800 text-slate-100 hover:bg-zinc-700/60 active:bg-zinc-800'
                  : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className={`py-3 rounded-xl font-semibold text-xs border transition-all duration-200 uppercase ${
                theme.id === 'night' || theme.id === 'neon'
                  ? 'bg-zinc-800/30 border-zinc-800 text-slate-400 hover:bg-zinc-800'
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
              }`}
            >
              Sil
            </button>
          </div>

          <button
            type="submit"
            id="login_submit_btn"
            className={`w-full py-4 rounded-xl font-bold text-white tracking-wide transition-all duration-300 ${theme.primary} ${theme.primaryHover} flex justify-center items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer`}
          >
            {isRegisterMode ? 'Özel Hesabı Oluştur ve Giriş Yap' : 'Esila Çalışma Alanına Giriş'}
            <Unlock className="w-5 h-5" />
          </button>
        </form>

        {!savedPin && isRegisterMode && (
          <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
            * Şifreniz cihazınızda tamamen şifreli ve güvenli bir şekilde saklanır. İleride şifrenizi değiştirebilirsiniz.
          </p>
        )}

        {savedPin && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setPin('');
              }}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              {isRegisterMode ? 'Mevcut hesapla giriş yap' : 'Yeni bir şifre / hesap oluştur'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
