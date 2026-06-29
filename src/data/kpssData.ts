/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Topic, Badge, DailyMission } from '../types';

export const KPSS_SUBJECTS: Subject[] = [
  { id: 'turkce', name: 'Türkçe', color: '#ec4899', icon: 'BookOpen' }, // Pink
  { id: 'matematik', name: 'Matematik', color: '#8b5cf6', icon: 'Binary' }, // Lavender/Violet
  { id: 'tarih', name: 'Tarih', color: '#f59e0b', icon: 'History' }, // Amber/Gold
  { id: 'cografya', name: 'Coğrafya', color: '#10b981', icon: 'Compass' }, // Emerald
  { id: 'vatandaslik', name: 'Vatandaşlık', color: '#3b82f6', icon: 'ShieldAlert' }, // Blue
  { id: 'guncel', name: 'Güncel Bilgiler', color: '#06b6d4', icon: 'Globe' } // Cyan
];

export const DEFAULT_TOPICS: Omit<Topic, 'status' | 'questionCount' | 'studyDuration' | 'lastStudied'>[] = [
  // Türkçe
  { id: 'tr_1', subjectId: 'turkce', name: 'Sözcükte Anlam' },
  { id: 'tr_2', subjectId: 'turkce', name: 'Cümlede Anlam' },
  { id: 'tr_3', subjectId: 'turkce', name: 'Paragrafta Anlam (Yorumlama)' },
  { id: 'tr_4', subjectId: 'turkce', name: 'Paragrafta Yapı ve Anlatım Teknikleri' },
  { id: 'tr_5', subjectId: 'turkce', name: 'Ses Bilgisi' },
  { id: 'tr_6', subjectId: 'turkce', name: 'Yazım Kuralları' },
  { id: 'tr_7', subjectId: 'turkce', name: 'Noktalama İşaretleri' },
  { id: 'tr_8', subjectId: 'turkce', name: 'Sözcükte Yapı (Kök-Ek)' },
  { id: 'tr_9', subjectId: 'turkce', name: 'Sözcük Türleri (İsim, Sıfat, Zamir)' },
  { id: 'tr_10', subjectId: 'turkce', name: 'Sözcük Türleri (Zarf, Edat, Bağlaç, Ünlem)' },
  { id: 'tr_11', subjectId: 'turkce', name: 'Fiiller, Fiilimsiler ve Ek-Fiil' },
  { id: 'tr_12', subjectId: 'turkce', name: 'Cümlenin Ögeleri' },
  { id: 'tr_13', subjectId: 'turkce', name: 'Cümle Türleri' },
  { id: 'tr_14', subjectId: 'turkce', name: 'Anlatım Bozuklukları' },
  { id: 'tr_15', subjectId: 'turkce', name: 'Sözel Mantık' },

  // Matematik
  { id: 'mat_1', subjectId: 'matematik', name: 'Temel Kavramlar ve Sayılar' },
  { id: 'mat_2', subjectId: 'matematik', name: 'Bölme ve Bölünebilme Kuralları' },
  { id: 'mat_3', subjectId: 'matematik', name: 'Asal Çarpanlar ve EBOB-EKOK' },
  { id: 'mat_4', subjectId: 'matematik', name: 'Rasyonel ve Ondalık Sayılar' },
  { id: 'mat_5', subjectId: 'matematik', name: 'Birinci Dereceden Denklemler' },
  { id: 'mat_6', subjectId: 'matematik', name: 'Basit Eşitsizlikler' },
  { id: 'mat_7', subjectId: 'matematik', name: 'Mutlak Değer' },
  { id: 'mat_8', subjectId: 'matematik', name: 'Üslü Sayılar' },
  { id: 'mat_9', subjectId: 'matematik', name: 'Köklü Sayılar' },
  { id: 'mat_10', subjectId: 'matematik', name: 'Çarpanlara Ayırma' },
  { id: 'mat_11', subjectId: 'matematik', name: 'Oran - Orantı' },
  { id: 'mat_12', subjectId: 'matematik', name: 'Sayı ve Kesir Problemleri' },
  { id: 'mat_13', subjectId: 'matematik', name: 'Yaş Problemleri' },
  { id: 'mat_14', subjectId: 'matematik', name: 'İşçi Problemleri' },
  { id: 'mat_15', subjectId: 'matematik', name: 'Yüzde, Kar-Zarar, Faiz Problemleri' },
  { id: 'mat_16', subjectId: 'matematik', name: 'Karışım Problemleri' },
  { id: 'mat_17', subjectId: 'matematik', name: 'Hareket (Hız) Problemleri' },
  { id: 'mat_18', subjectId: 'matematik', name: 'Grafik Problemleri' },
  { id: 'mat_19', subjectId: 'matematik', name: 'Kümeler ve Kartezyen Çarpım' },
  { id: 'mat_20', subjectId: 'matematik', name: 'Fonksiyonlar' },
  { id: 'mat_21', subjectId: 'matematik', name: 'Permütasyon - Kombinasyon ve Olasılık' },
  { id: 'mat_22', subjectId: 'matematik', name: 'Sayısal Mantık' },
  { id: 'mat_23', subjectId: 'matematik', name: 'Geometri (Açılar ve Üçgenler)' },
  { id: 'mat_24', subjectId: 'matematik', name: 'Geometri (Çokgenler, Daire, Analitik)' },

  // Tarih
  { id: 'tar_1', subjectId: 'tarih', name: 'İslamiyet Öncesi Türk Tarihi' },
  { id: 'tar_2', subjectId: 'tarih', name: 'İlk Türk-İslam Devletleri ve Beylikleri' },
  { id: 'tar_3', subjectId: 'tarih', name: 'Osmanlı Devleti Kuruluş ve Yükselme Dönemleri' },
  { id: 'tar_4', subjectId: 'tarih', name: 'Osmanlı Devleti Duraklama ve Gerileme Dönemleri' },
  { id: 'tar_5', subjectId: 'tarih', name: 'Osmanlı Devleti Dağılma Dönemi ve Islahatlar' },
  { id: 'tar_6', subjectId: 'tarih', name: 'Osmanlı Kültür ve Medeniyeti' },
  { id: 'tar_7', subjectId: 'tarih', name: '20. Yüzyıl Başlarında Osmanlı (I. Dünya Savaşı ve Sonuçları)' },
  { id: 'tar_8', subjectId: 'tarih', name: 'Kurtuluş Savaşı Hazırlık Dönemi (Kongreler ve Genelgeler)' },
  { id: 'tar_9', subjectId: 'tarih', name: 'I. TBMM Dönemi ve Sevr Barışı' },
  { id: 'tar_10', subjectId: 'tarih', name: 'Kurtuluş Savaşı Muharebeler ve Antlaşmalar' },
  { id: 'tar_11', subjectId: 'tarih', name: 'Atatürk İlke ve İnkılapları' },
  { id: 'tar_12', subjectId: 'tarih', name: 'Atatürk Dönemi Türk Dış Politikası' },
  { id: 'tar_13', subjectId: 'tarih', name: 'Çağdaş Türk ve Dünya Tarihi' },

  // Coğrafya
  { id: 'cog_1', subjectId: 'cografya', name: 'Türkiye’nin Coğrafi Konumu ve Etkileri' },
  { id: 'cog_2', subjectId: 'cografya', name: 'Türkiye’nin Yerşekilleri ve Jeolojik Yapısı' },
  { id: 'cog_3', subjectId: 'cografya', name: 'Türkiye’nin İklimi, Sıcaklık ve Yağış Koşulları' },
  { id: 'cog_4', subjectId: 'cografya', name: 'Türkiye’nin Bitki Örtüsü, Toprak ve Su Varlığı' },
  { id: 'cog_5', subjectId: 'cografya', name: 'Türkiye’de Doğal Afetler ve Çevre Sorunları' },
  { id: 'cog_6', subjectId: 'cografya', name: 'Türkiye’nin Beşeri Coğrafyası (Nüfus ve Göç)' },
  { id: 'cog_7', subjectId: 'cografya', name: 'Türkiye’de Yerleşmeler ve Kentleşme' },
  { id: 'cog_8', subjectId: 'cografya', name: 'Türkiye’de Tarım Ürünleri ve Dağılımı' },
  { id: 'cog_9', subjectId: 'cografya', name: 'Türkiye’de Hayvancılık ve Ormancılık' },
  { id: 'cog_10', subjectId: 'cografya', name: 'Türkiye’nin Madenleri ve Enerji Kaynakları' },
  { id: 'cog_11', subjectId: 'cografya', name: 'Türkiye’de Sanayi ve Sanayi Kolları' },
  { id: 'cog_12', subjectId: 'cografya', name: 'Türkiye’de Ulaşım, Ticaret ve Turizm' },
  { id: 'cog_13', subjectId: 'cografya', name: 'Türkiye’nin Coğrafi Bölgeleri ve Bölgesel Projeler' },

  // Vatandaşlık
  { id: 'vat_1', subjectId: 'vatandaslik', name: 'Hukukun Temel Kavramları ve Dalları' },
  { id: 'vat_2', subjectId: 'vatandaslik', name: 'Devlet Biçimleri, Hükümet Sistemleri ve Demokrasi' },
  { id: 'vat_3', subjectId: 'vatandaslik', name: 'Anayasa Tarihi ve 1982 Anayasası Temel İlkeleri' },
  { id: 'vat_4', subjectId: 'vatandaslik', name: 'Temel Hak ve Ödevler' },
  { id: 'vat_5', subjectId: 'vatandaslik', name: 'Yasama Organı (TBMM Yapısı, Seçimler ve Yasama Faaliyetleri)' },
  { id: 'vat_6', subjectId: 'vatandaslik', name: 'Yürütme Organı (Cumhurbaşkanı ve Yürütme Görevi)' },
  { id: 'vat_7', subjectId: 'vatandaslik', name: 'Yargı Organı (Anayasa, Danıştay, Yargıtay vb. Mahkemeler)' },
  { id: 'vat_8', subjectId: 'vatandaslik', name: 'İdare Hukuku (Kamu Hizmetleri, Mahalli İdareler, Memurluk)' },

  // Güncel Bilgiler
  { id: 'gun_1', subjectId: 'guncel', name: 'Uluslararası Kuruluşlar (BM, NATO, AB, İslam İşbirliği Teşkilatı vb.)' },
  { id: 'gun_2', subjectId: 'guncel', name: 'Türkiye ve Dünyadaki Tarihi ve Kültürel Miraslar' },
  { id: 'gun_3', subjectId: 'guncel', name: 'Dünyadaki Bilimsel ve Teknolojik Gelişmeler' },
  { id: 'gun_4', subjectId: 'guncel', name: 'Önemli Edebiyatçılar, Sanatçılar, Eserler ve Ödüller' },
  { id: 'gun_5', subjectId: 'guncel', name: 'Spor Dalları, Olimpiyatlar ve Önemli Başarılar' },
  { id: 'gun_6', subjectId: 'guncel', name: '2026 Yılı Güncel Gelişmeler ve Gündemdeki Olaylar' }
];

export const MOTIVATIONAL_QUOTES: string[] = [
  "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. Esila, bugün o adımı at!",
  "Gelecek, bugünden ona hazırlananlarındır. KPSS 2026 senin yılın olacak!",
  "Pes etmeyenler her zaman kazanır. Zorluklar seni daha güçlü kılacak.",
  "Zor olan her şey, ulaşıldığında daha değerlidir. Esila Study ile hedefine odaklan!",
  "Bugün yaptığın çalışmalar, yarınki gülümsemenin mimarıdır.",
  "Rüyalarını gerçekleştirmek istiyorsan, uykudan uyanmalı ve çalışmalısın.",
  "Büyük işler başarmak için sadece harekete geçmek yetmez; aynı zamanda hayal etmeli ve inanmalıyız.",
  "Kendine inan Esila, sen bu sınavın üstesinden gelebilecek güçtesin!",
  "Yol ne kadar uzun olursa olsun, ilk adımla başlar. Bugünün hedefini tamamla!"
];

export const ALL_BADGES: Badge[] = [
  { id: 'badge_first_step', title: 'İlk Adım', description: 'Uygulamayı ilk kez kullanmaya başla.', icon: 'CheckCircle', unlockedXp: 50 },
  { id: 'badge_pomodoro_1', title: 'Odaklanma Ustası', description: 'İlk Pomodoro oturumunu tamamla.', icon: 'Timer', unlockedXp: 100 },
  { id: 'badge_pomodoro_5', title: 'Zaman Bükücü', description: 'Toplam 5 Pomodoro oturumu tamamla.', icon: 'Hourglass', unlockedXp: 250 },
  { id: 'badge_questions_100', title: 'Soru Avcısı', description: 'Toplam 100 soru çöz.', icon: 'Target', unlockedXp: 200 },
  { id: 'badge_questions_500', title: 'Soru Canavarı', description: 'Toplam 500 soru çöz.', icon: 'Flame', unlockedXp: 500 },
  { id: 'badge_topic_1', title: 'İlk Konu Fethedildi', description: 'Bir konunun durumunu "Tamamlandı" yap.', icon: 'Award', unlockedXp: 150 },
  { id: 'badge_topic_10', title: 'Konu Uzmanı', description: 'Toplam 10 konuyu "Tamamlandı" yap.', icon: 'ShieldCheck', unlockedXp: 400 },
  { id: 'badge_exam_1', title: 'İlk Sınav Deneyimi', description: 'İlk deneme sınavını kaydet.', icon: 'ClipboardSignature', unlockedXp: 200 },
  { id: 'badge_streak_3', title: 'İstikrarlı Çalışan', description: '3 günlük çalışma serisine ulaş.', icon: 'CalendarDays', unlockedXp: 150 },
  { id: 'badge_streak_7', title: 'Alev Alıyor', description: '7 günlük çalışma serisine ulaş.', icon: 'Zap', unlockedXp: 350 },
  { id: 'badge_xp_1000', title: 'XP Zengini', description: '1,000 XP puanına ulaş.', icon: 'Gem', unlockedXp: 300 }
];

export const DEFAULT_MISSIONS = (): DailyMission[] => [
  { id: 'm1', text: 'Bugün en az 60 dakika çalış', xpReward: 100, targetValue: 60, currentValue: 0, type: 'STUDY_TIME', completed: false },
  { id: 'm2', text: 'Bugün en az 50 soru çöz', xpReward: 80, targetValue: 50, currentValue: 0, type: 'QUESTIONS', completed: false },
  { id: 'm3', text: 'En az 1 konunun durumunu güncelle', xpReward: 50, targetValue: 1, currentValue: 0, type: 'TOPIC_COMPLETE', completed: false },
  { id: 'm4', text: 'Bugün için bir ders notu al', xpReward: 40, targetValue: 1, currentValue: 0, type: 'NOTE_TAKEN', completed: false }
];
