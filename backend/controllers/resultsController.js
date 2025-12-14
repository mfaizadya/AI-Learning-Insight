const db = require("../db/connection");
const axios = require("axios");

// helper
function normalizeDbResult(result) {
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0];
  }
  return result;
}

/**
 * Submit Learning Pattern (POLA) Result
 */
async function submitPolaResult(req, res, next) {
  let connection;
  try {
    const userId = req.user?.id || req.body.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: User ID missing." });
    }

    const { test_id, answers } = req.body;

    if (!test_id || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid payload." });
    }

    const submittedChoiceIds = [
      ...new Set(answers.map((a) => parseInt(a.pilihan_id))),
    ];

    const queryChoices = `
      SELECT id, soal_id, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced 
      FROM pilihan_pola 
      WHERE id IN (?)
    `;

    const rawResult = await db.query(queryChoices, [submittedChoiceIds]);
    const dbChoices = normalizeDbResult(rawResult);

    if (!Array.isArray(dbChoices) || dbChoices.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid pilihan_id provided or Database returned no data.",
      });
    }

    const features = [];
    const totalScores = { consistent: 0, fast: 0, reflective: 0, balanced: 0 };

    const answerMap = new Map();
    dbChoices.forEach((c) => answerMap.set(c.soal_id, c));

    for (let qId = 1; qId <= 9; qId++) {
      const choice = answerMap.get(qId);

      if (choice) {
        const val =
          choice.bobot_consistent +
          choice.bobot_fast +
          choice.bobot_reflective +
          choice.bobot_balanced;
        features.push(val);

        totalScores.consistent += choice.bobot_consistent;
        totalScores.fast += choice.bobot_fast;
        totalScores.reflective += choice.bobot_reflective;
        totalScores.balanced += choice.bobot_balanced;
      } else {
        features.push(0);
      }
    }

    let predictionLabel = "Unknown";
    if (process.env.ML_ENDPOINT) {
      try {
        const mlResponse = await axios.post(
          `${process.env.ML_ENDPOINT}/predict`,
          { features: features },
          { timeout: 10000 }
        );
        predictionLabel = Array.isArray(mlResponse.data.prediction_label)
          ? mlResponse.data.prediction_label[0]
          : mlResponse.data.prediction_label;
      } catch (mlErr) {
        console.error("ML Error:", mlErr.message);
      }
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [headerRes] = await connection.execute(
      `INSERT INTO hasil_test (user_id, test_pola_id, label_pola, timestamp) VALUES (?, ?, ?, NOW())`,
      [userId, test_id, predictionLabel]
    );
    const resultId = headerRes.insertId;

    const detailValues = dbChoices.map((c) => [
      resultId,
      c.soal_id,
      c.id,
      c.bobot_consistent,
      c.bobot_fast,
      c.bobot_reflective,
      c.bobot_balanced,
    ]);

    if (detailValues.length > 0) {
      await connection.query(
        `INSERT INTO hasil_test_pola_detail (hasil_test_id, soal_id, pilihan_id, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced) VALUES ?`,
        [detailValues]
      );
    }

    const dbLabel = predictionLabel.toLowerCase().split(" ")[0];
    await connection.execute(
      `UPDATE users SET learning_pattern = ? WHERE id = ?`,
      [dbLabel, userId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Pola test submitted.",
      data: {
        result_id: resultId,
        learning_pattern: predictionLabel,
        scores: totalScores,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Submit Pola Error:", error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Submit Learning Style (GAYA) Result
 */
async function submitGayaResult(req, res, next) {
  let connection;
  try {
    const userId = req.user?.id || req.body.user_id;
    if (!userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });

    const { test_id, answers, hasil_test_id } = req.body;
    const validHasilTestId = parseInt(hasil_test_id);

    if (
      !validHasilTestId ||
      !test_id ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid payload. Missing valid hasil_test_id, test_id, or answers.",
      });
    }

    const submittedChoiceIds = [
      ...new Set(answers.map((a) => parseInt(a.pilihan_id))),
    ];

    const queryChoices = `
      SELECT id, soal_id, bobot_visual, bobot_auditori, bobot_kinestetik 
      FROM pilihan_gaya 
      WHERE id IN (?)
    `;

    const rawResult = await db.query(queryChoices, [submittedChoiceIds]);
    const dbChoices = normalizeDbResult(rawResult);

    if (!Array.isArray(dbChoices) || dbChoices.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid pilihan_id provided." });
    }

    let stats = { visual: 0, auditori: 0, kinestetik: 0 };

    dbChoices.forEach((c) => {
      stats.visual += c.bobot_visual;
      stats.auditori += c.bobot_auditori;
      stats.kinestetik += c.bobot_kinestetik;
    });

    const winnerKey = Object.keys(stats).reduce((a, b) =>
      stats[a] >= stats[b] ? a : b
    );

    const totalPoints = stats.visual + stats.auditori + stats.kinestetik;
    const winPercent =
      totalPoints > 0 ? Math.round((stats[winnerKey] / totalPoints) * 100) : 0;

    const displayLabel = winnerKey.charAt(0).toUpperCase() + winnerKey.slice(1);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const updateQuery = `
        UPDATE hasil_test 
        SET test_gaya_id = ?, label_gaya = ?, persentase_gaya = ? 
        WHERE id = ? AND user_id = ?
    `;
    const [updateRes] = await connection.execute(updateQuery, [
      test_id,
      displayLabel,
      winPercent,
      validHasilTestId,
      userId,
    ]);

    if (updateRes.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: "Target Hasil test (ID Pola) tidak ditemukan atau tidak valid.",
      });
    }

    const resultId = validHasilTestId;

    const detailValues = dbChoices.map((c) => [
      resultId,
      c.soal_id,
      c.id,
      c.bobot_visual,
      c.bobot_auditori,
      c.bobot_kinestetik,
    ]);

    if (detailValues.length > 0) {
      await connection.query(
        `INSERT INTO hasil_test_gaya_detail (hasil_test_id, soal_id, pilihan_id, bobot_visual, bobot_auditori, bobot_kinestetik) VALUES ?`,
        [detailValues]
      );
    }

    // C. Update User
    await connection.execute(
      `UPDATE users SET learning_style = ? WHERE id = ?`,
      [winnerKey, userId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Gaya test submitted and combined.",
      data: {
        result_id: resultId,
        learning_style: winnerKey,
        percentage: winPercent,
        scores: stats,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Submit Gaya Error:", error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function getHistoryList(req, res, next) {
  try {
    const userId = req.user.id;
    const query = `
      SELECT 
          id, 
          timestamp,
          label_pola AS title,
          label_gaya AS subtitle,
          persentase_gaya AS score,
          'combined' as test_type
      FROM hasil_test 
      WHERE user_id = ? AND label_pola IS NOT NULL AND label_gaya IS NOT NULL
      ORDER BY timestamp DESC
    `;

    const rawResult = await db.query(query, [userId]);
    const rows = normalizeDbResult(rawResult);

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getHistoryDetail(req, res, next) {
  try {
    const historyId = req.params.id;
    const userId = req.user.id;

    const headerQuery = `SELECT * FROM hasil_test WHERE id = ? AND user_id = ?`;
    const rawHeader = await db.query(headerQuery, [historyId, userId]);
    const headerRows = normalizeDbResult(rawHeader);

    if (headerRows.length === 0)
      return res.status(404).json({ success: false, error: "Not found" });
    const header = headerRows[0];

    // fetch
    const rawGaya = await db.query(
      `SELECT SUM(bobot_visual) as visual, SUM(bobot_auditori) as auditori, SUM(bobot_kinestetik) as kinestetik FROM hasil_test_gaya_detail WHERE hasil_test_id = ?`,
      [header.id]
    );
    const gayaRows = normalizeDbResult(rawGaya);
    const gayaScores = gayaRows[0];
    // 
    const valVisual = Number(gayaScores.visual || 0);
    const valAuditori = Number(gayaScores.auditori || 0);
    const valKinestetik = Number(gayaScores.kinestetik || 0);
    const totalGaya = valVisual + valAuditori + valKinestetik || 1;

    const rawPola = await db.query(
      `SELECT SUM(bobot_consistent) as consistent, SUM(bobot_fast) as fast, SUM(bobot_reflective) as reflective, SUM(bobot_balanced) as balanced FROM hasil_test_pola_detail WHERE hasil_test_id = ?`,
      [header.id]
    );
    const polaRows = normalizeDbResult(rawPola);
    const polaScores = polaRows[0];

    const finalData = {
      id: header.id,
      date: new Date(header.timestamp).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      timestamp: header.timestamp,
      type: "combined",
      patternResult: header.label_pola,
      styleResult: header.label_gaya,
      score: header.persentase_gaya,
      styleBreakdown: {
        visual: valVisual,
        auditori: valAuditori,
        kinestetik: valKinestetik,
      },
      summary:
        "Laporan gabungan Pola Belajar dan Gaya Belajar. Anda dapat melihat rincian skor Pola dan Gaya di bagian teknis.",
      detailScores: {
        pola: polaScores,
        gaya: {
          ...gayaScores,
          visual_percent: Math.round((valVisual / totalGaya) * 100),
          auditori_percent: Math.round((valAuditori / totalGaya) * 100),
          kinestetik_percent: Math.round((valKinestetik / totalGaya) * 100),
        },
      },
    };

    res.json({
      success: true,
      data: finalData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitPolaResult,
  submitGayaResult,
  getHistoryList,
  getHistoryDetail,
};
