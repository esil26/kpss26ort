/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Sparkles, Award, Target, Save, Trash2, Plus, Download, Upload, 
  RotateCcw, Palette, Check, HelpCircle, AlertTriangle
} from 'lucide-react';
import { AppState, ThemeType } from '../types';
import { ThemeConfig, THEME_CONFIGS } from '../lib/themeUtils';

interface ProfileSettingsProps {
  appState: AppState;
  theme: ThemeConfig;
  onUpdateProfile: (name: string, targetScore: number, targetJob: string, personalGoals: string[]) => void;
  onSelectTheme: (themeId: ThemeType) => void;
  onResetDatabase: () => void;
  onImportBackup: (backup: AppState) => void;
}

export default function ProfileSettings({
  appState,
  theme,
  onUpdateProfile,
  onSelectTheme,
  onResetDatabase,
  onImportBackup
}: ProfileSettingsProps) {
  // Profile form states
  const [name, setName] = useState(appState.profile.name);
  const [targetScore, setTargetScore] = useState(appState.profile.targetScore);
  const [targetJob, setTargetJob] = useState(appState.profile.targetJob);
  const [personalGoals, setPersonalGoals] = useState<string[]>(appState.profile.personalGoals);
  
  // Custom goal add state
  const [newPersonalGoal, setNewPersonalGoal] = useState('');
  
  // States for backup file import
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, Number(targetScore), targetJob, personalGoals);
    
    setSuccessMsg('Profil bilgileriniz başarıyla kaydedildi!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddPersonalGoal = () => {
    if (newPersonalGoal.trim() && !personalGoals.includes(newPersonalGoal.trim())) {
      setPersonalGoals([...personalGoals, newPersonalGoal.trim()]);
      setNewPersonalGoal('');
    }
  };

  const handleRemovePersonalGoal = (goalToRemove: string) => {
    setPersonalGoals(personalGoals.filter(g => g !== goalToRemove));
  };

  // Secure JSON Backup Export
  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `EsilaStudy_Yedek_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setSuccessMsg('Çalışma veritabanı başarıyla yedeklendi! .json dosyası indirildi.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Yedek oluşturulurken bir hata oluştu.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Secure JSON Backup Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          
          // Basic validations
          if (parsedData.profile && parsedData.topics && parsedData.studySessions) {
            onImportBackup(parsedData);
            setSuccessMsg('Veriler yedekten başarıyla yüklendi! Uygulama yenileniyor.');
            setTimeout(() => {
              setSuccessMsg('');
              window.location.reload();
            }, 1500);
          } else {
            setErrorMsg('Hatalı Dosya Formatı! Lütfen geçerli bir Esila Study yedek dosyası yükleyin.');
          }
        } catch (error) {
          setErrorMsg('Yedek dosyası okunamadı veya ayrıştırılamadı.');
        }
      };
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm('TÜM verilerinizin sıfırlanmasını istiyor musunuz? Bu işlem geri alınamaz!')) {
      onResetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6" id="settings_tab">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-rose-500" />
          Kişisel Profil & Hedefler
        </h2>
        <p className="text-sm mt-1 text-slate-400 font-medium">
          Hedef puanını belirle, uygulamayı dilediğin temaya uyarla ve çalışma verilerini güvenle yedekle.
        </p>
      </div>

      {/* Success / Error notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs border border-emerald-100 font-bold flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs border border-red-100 font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile editing form */}
        <div className={`lg:col-span-2 p-6 rounded-3xl ${theme.cardBg} border shadow-sm space-y-5`}>
          <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3 mb-1">
            <Target className="w-5 h-5 text-rose-500" />
            Esila KPSS Ortaöğretim Hedefleri
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  İsminiz
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Hedef KPSS Puanı
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="50"
                  max="100"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Hedef Meslek / Kurum
              </label>
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="Örn. Kamu Personeli, Atanmış Devlet Memuru"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                  theme.id === 'night' || theme.id === 'neon'
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500'
                    : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                }`}
                required
              />
            </div>

            {/* Personal goals checklists */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Kişisel Hedef ve Hayallerim
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newPersonalGoal}
                  onChange={(e) => setNewPersonalGoal(e.target.value)}
                  placeholder="Örn. Günde 1 deneme çözme alışkanlığı"
                  className={`flex-1 px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                    theme.id === 'night' || theme.id === 'neon'
                      ? 'bg-zinc-800 border-zinc-700 text-slate-100 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-200 focus:ring-rose-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddPersonalGoal}
                  className={`px-3 py-2 text-white rounded-xl font-bold text-xs cursor-pointer ${theme.primary} ${theme.primaryHover}`}
                >
                  Ekle
                </button>
              </div>

              {/* Goals list items */}
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {personalGoals.map((goal, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center p-2 rounded-xl bg-slate-500/5 border border-dashed text-xs font-medium"
                  >
                    <span>🎯 {goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePersonalGoal(goal)}
                      className="text-slate-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${theme.primary} ${theme.primaryHover}`}
            >
              <Save className="w-4 h-4" />
              Profili Güncelle
            </button>
          </form>

        </div>

        {/* Themes section */}
        <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm space-y-4`}>
          <h3 className="font-extrabold text-base flex items-center gap-2 border-b pb-3 mb-1">
            <Palette className="w-5 h-5 text-violet-500" />
            Tema Seçimi
          </h3>

          <div className="space-y-3">
            {Object.values(THEME_CONFIGS).map((cfg) => {
              const isSel = theme.id === cfg.id;
              return (
                <button
                  key={cfg.id}
                  onClick={() => onSelectTheme(cfg.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSel 
                      ? 'border-rose-500/40 bg-rose-500/5 ring-2 ring-rose-400' 
                      : 'border-slate-100 bg-white dark:bg-zinc-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${cfg.gradient} border shrink-0`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {cfg.name}
                    </span>
                  </div>
                  {isSel && (
                    <span className="p-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Database Backup and Safety Panel */}
      <div className={`p-6 rounded-3xl ${theme.cardBg} border shadow-sm`}>
        <h3 className="font-extrabold text-lg flex items-center gap-2 border-b pb-4 mb-4">
          <Palette className="w-5 h-5 text-rose-500" />
          Yedekleme & Veri Güvenliği Paneli
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
          Esila Study, tüm verilerinizi tarayıcınızın yerel depolama alanında şifreli olarak korur. Tarayıcı önbelleği silindiğinde veri kaybı 
          yaşamamak için, haftalık olarak verilerinizi bilgisayarınıza yedeklemenizi (indirmek) önemle rica ederiz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Export card */}
          <div className="p-5 rounded-2xl border border-dashed bg-slate-500/5 flex flex-col justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-pink-500 bg-pink-100 dark:bg-pink-950/40 px-2 py-0.5 rounded">GÜVENLİ</span>
              <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-2">Çalışma Verilerini Yedekle</h4>
              <p className="text-[11px] text-slate-400 mt-1">Tüm KPSS konularını, çözdüğün soru sayılarını ve deneme sınavlarını kapsayan bir .json yedek dosyası indir.</p>
            </div>
            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Yedek Dosyası İndir
            </button>
          </div>

          {/* Import card */}
          <div className="p-5 rounded-2xl border border-dashed bg-slate-500/5 flex flex-col justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-violet-500 bg-violet-100 dark:bg-violet-950/40 px-2 py-0.5 rounded">GERİ YÜKLE</span>
              <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-2">Yedekten Geri Yükle</h4>
              <p className="text-[11px] text-slate-400 mt-1">Önceden bilgisayarına indirdiğin .json yedek dosyasını uygulamaya yükle ve kaldığın yerden devam et.</p>
            </div>
            
            {/* Custom file upload button */}
            <div className="relative w-full">
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <button
                className="w-full py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Dosya Seç ve Geri Yükle
              </button>
            </div>
          </div>

          {/* Wipe data card */}
          <div className="p-5 rounded-2xl border border-dashed bg-slate-500/5 flex flex-col justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded">TEHLİKE</span>
              <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-2">Veritabanını Temizle</h4>
              <p className="text-[11px] text-slate-400 mt-1">Uygulamadaki tüm çalışma veritabanını sıfırlayarak, KPSS 2026 serüvenine temiz bir sayfa açın.</p>
            </div>
            <button
              onClick={handleResetConfirm}
              className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Tüm Verileri Temizle
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
