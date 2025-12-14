const db = require("../db/connection");
const { getRandomQuote } = require("../utils/quoteLibrary");

// normalization helper
function normalizeDbResult(result) {
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0];
  }
  return result;
}

function generateSmartTitle(content) {
  if (!content) return "Saran Pengembangan";

  const text = content.toLowerCase();

  //   visual
  if (
    text.includes("mind-mapping") ||
    text.includes("diagram") ||
    text.includes("peta konsep")
  )
    return "Visualisasi & Struktur";
  if (text.includes("video") || text.includes("animasi"))
    return "Media Pembelajaran Digital";
  if (
    text.includes("stabilo") ||
    text.includes("warna") ||
    text.includes("color-coding")
  )
    return "Teknik Penandaan (Marking)";

  // auditory
  if (text.includes("rekam") || text.includes("dengarkan"))
    return "Metode Re-listening";
  if (
    text.includes("jelaskan") ||
    text.includes("feynman") ||
    text.includes("diskusi")
  )
    return "Teknik Feynman (Verbal)";
  if (
    text.includes("bising") ||
    text.includes("musik") ||
    text.includes("suara")
  )
    return "Manajemen Lingkungan Audio";

  // kinesthetic
  if (
    text.includes("simulasi") ||
    text.includes("praktik") ||
    text.includes("hands-on")
  )
    return "Simulasi & Studi Kasus";
  if (
    text.includes("berjalan") ||
    text.includes("gerak") ||
    text.includes("active recall")
  )
    return "Active Recall Fisik";
  if (
    text.includes("pomodoro") ||
    text.includes("istirahat") ||
    text.includes("peregangan")
  )
    return "Manajemen Energi & Fokus";

  // learning pattern
  if (
    text.includes("jadwal") ||
    text.includes("rutinitas") ||
    text.includes("konsistensi")
  )
    return "Optimasi Rutinitas";
  if (
    text.includes("lupa cepat") ||
    text.includes("spaced repetition") ||
    text.includes("srs")
  )
    return "Strategi Retensi Memori";
  if (text.includes("analisis") || text.includes("dalam"))
    return "Deep Learning Strategy";
  if (text.includes("variasi") || text.includes("jenuh"))
    return "Pencegahan Burnout";

  // Default Fallback
  return "Rekomendasi Personal";
}

/**
 *  Dashboard Endpoint Agregat
 */
async function getDashboardData(req, res, next) {
  try {
    const userId = req.user.id;

    // =========================================
    // 1. Ambil Data User
    // =========================================
    const userQuery = `SELECT username, email, learning_pattern, learning_style FROM users WHERE id = ?`;
    const rawUser = await db.query(userQuery, [userId]);
    const userRow = normalizeDbResult(rawUser)[0];

    // =========================================
    // 2. Ambil Hasil Tes Terakhir (Pola & Gaya)
    // =========================================
    const lastTestQuery = `
            SELECT id, label_pola, label_gaya, persentase_gaya
            FROM hasil_test 
            WHERE user_id = ? AND label_gaya IS NOT NULL
            ORDER BY timestamp DESC
            LIMIT 1
        `;
    const rawLastTest = await db.query(lastTestQuery, [userId]);
    const lastTestRow = normalizeDbResult(rawLastTest)[0];

    // =========================================
    // 3. Proses Statistik & Breakdown
    // =========================================
    let styleBreakdown = { visual: 0, auditori: 0, kinestetik: 0 };
    let statisticsData = [];

    if (lastTestRow) {
      const rawGayaScores = await db.query(
        `SELECT SUM(bobot_visual) as visual, SUM(bobot_auditori) as auditori, SUM(bobot_kinestetik) as kinestetik 
         FROM hasil_test_gaya_detail 
         WHERE hasil_test_id = ?`,
        [lastTestRow.id]
      );
      const gayaScores = normalizeDbResult(rawGayaScores)[0];

      const visual = Number(gayaScores?.visual || 0);
      const auditori = Number(gayaScores?.auditori || 0);
      const kinestetik = Number(gayaScores?.kinestetik || 0);
      const total = visual + auditori + kinestetik;

      styleBreakdown = { visual, auditori, kinestetik };

      if (total > 0) {
        statisticsData = [
          {
            type: "visual",
            visitors: Math.round((visual / total) * 100),
            fill: "hsl(var(--primary))",
            label: "Visual",
          },
          {
            type: "auditori",
            visitors: Math.round((auditori / total) * 100),
            fill: "hsl(var(--accent))",
            label: "Auditori",
          },
          {
            type: "kinestetik",
            visitors: Math.round((kinestetik / total) * 100),
            fill: "hsl(var(--muted))",
            label: "Kinestetik",
          },
        ];
      }
    }

    // =========================================
    // 4. Ambil Real Insights dari Database
    // =========================================
    const insightQuery = `
        SELECT id, insight 
        FROM insight 
        WHERE user_id = ? 
        ORDER BY id DESC 
        LIMIT 3
    `;
    const rawInsights = await db.query(insightQuery, [userId]);
    const insightRows = normalizeDbResult(rawInsights);

    const mappedInsights = insightRows.map((item, index) => ({
      id: item.id,
      title: generateSmartTitle(item.insight),
      description: item.insight,
    }));

    // =========================================
    // 5. Quote Harian
    // =========================================
    const dailyQuote = getRandomQuote();

    // =========================================
    // 6. Final Aggregation
    // =========================================
    const finalData = {
      user: {
        name: userRow?.username || "Siswa",
        quote: dailyQuote,
      },
      learningPattern: {
        type: lastTestRow?.label_pola || "Belum Tes",
        description: lastTestRow?.label_pola
          ? `Pola Anda teridentifikasi sebagai ${lastTestRow.label_pola}.`
          : "Lakukan tes Pola Belajar untuk mendapatkan wawasan pribadi.",
      },
      learningStyle: {
        type: lastTestRow?.label_gaya || "Belum Tes",
        percentage: lastTestRow?.persentase_gaya || 0,
        breakdown: styleBreakdown,
      },
      //
      insights: mappedInsights,
      statistics: statisticsData,
    };

    res.status(200).json({ success: true, data: finalData });
  } catch (err) {
    console.error("Dashboard Aggregation Error:", err);
    next(err);
  }
}

module.exports = { getDashboardData };
