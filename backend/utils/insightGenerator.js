const db = require("../db/connection");

const INSIGHT_LIBRARY = {
  // learning style
  visual: [
    // Strategi: Visualisasi Spasial & Coding Warna
    "Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.",
    "Sebelum masuk ke detail, lihatlah 'gambaran besar' (Big Picture) materi melalui peta konsep atau daftar isi visual.",
  ],

  auditori: [
    // Strategi: Pemrosesan Verbal & Diskusi
    "Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.",
    "Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).",
  ],

  kinestetik: [
    // Strategi: Pembelajaran Somatik & Aktivitas Fisik
    "Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.",
    "Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.",
  ],

  // (Learning Patterns)
  consistent: [
    // Strength: Disiplin | Advice: Optimasi & Pencegahan Burnout
    "Kekuatan utamamu adalah rutinitas. Pertahankan jadwal ini, namun sisipkan variasi materi agar otak tidak mengalami kejenuhan (plateau).",
    "Gunakan kebiasaan baikmu untuk mulai menargetkan materi yang lebih kompleks secara bertahap (*Progressive Overload* dalam belajar).",
  ],

  fast: [
    // Strength: Kecepatan | Advice: Retensi & Kedalaman
    "Kamu menyerap informasi dengan cepat, namun hati-hati dengan 'lupa cepat'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.",
    "Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.",
  ],

  reflective: [
    // Strength: Analisis | Advice: Efisiensi Waktu & Aksi
    "Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.",
    "Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.",
  ],

  balanced: [
    // Strength: Adaptabilitas | Advice: Strategi Kontekstual
    "Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).",
    "Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.",
  ],
};

/**
 * Generator Insight Otomatis
 * Fungsi ini dipanggil oleh Controller setelah hasil tes dihitung.
 * * @param {number} userId - ID User pemilik hasil tes
 * @param {string} rawLabel - Label hasil tes (ex: "Visual", "Fast Learner")
 * @param {string} category - Kategori tes ('gaya' atau 'pola')
 */
const generateAndSaveInsights = async (userId, rawLabel, category) => {
  try {
    if (!rawLabel) return;

    let key = rawLabel.toLowerCase();

    if (key.includes("learner")) {
      key = key.replace(" learner", "").trim();
    }

    const selectedInsights = INSIGHT_LIBRARY[key];

    if (!selectedInsights || selectedInsights.length === 0) {
      console.warn(
        `[InsightGenerator] No insights found for key: '${key}' (Raw: ${rawLabel})`
      );
      return;
    }

    const insertValues = selectedInsights.map((text) => [userId, text]);
    const query = "INSERT INTO insight (user_id, insight) VALUES ?";
    await db.query(query, [insertValues]);

    console.log(
      `[InsightGenerator] Success: Generated ${insertValues.length} insights for User ${userId} (${key})`
    );
  } catch (error) {
    console.error(
      "[InsightGenerator] Failed to generate insights:",
      error.message
    );
  }
};

module.exports = { generateAndSaveInsights };
