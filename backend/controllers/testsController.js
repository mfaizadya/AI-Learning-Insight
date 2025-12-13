const db = require("../db/connection");

/**
 * Retrieve all tests of a specific type (pola or gaya)
 * Fetches the list of available tests based on the requested category parameter.
 * * @param {Object} req - Express request object containing the test type parameter
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestList(req, res, next) {
  try {
    const testType = req.params.type;

    // Strict validation to ensure security and prevent SQL injection on table names
    if (testType !== "pola" && testType !== "gaya") {
      return res.status(400).json({
        success: false,
        error: 'Invalid test type. Must be "pola" or "gaya"',
      });
    }

    // Dynamically select the table based on the validated type
    const tableName = testType === "pola" ? "test_pola" : "test_gaya";

    const tests = await db.query(`SELECT * FROM ${tableName}`);

    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve individual test details with nested questions and choices
 * Uses an optimized SQL JOIN strategy to fetch the test, questions, and choices
 * in a single database query round-trip.
 * * @param {Object} req - Express request object containing type and id
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestById(req, res, next) {
  try {
    const testType = req.params.type;
    const testId = req.params.id;

    // Validate test type parameter
    if (testType !== "pola" && testType !== "gaya") {
      return res.status(400).json({
        success: false,
        error: 'Invalid test type. Must be "pola" or "gaya"',
      });
    }

    // Configure table names based on the test type
    const testTable = testType === "pola" ? "test_pola" : "test_gaya";
    const questionTable = testType === "pola" ? "soal_pola" : "soal_gaya";
    const choiceTable = testType === "pola" ? "pilihan_pola" : "pilihan_gaya";

    // select specific weight columns based on the test type
    const weightColumns =
      testType === "pola"
        ? "c.bobot_consistent, c.bobot_fast, c.bobot_reflective, c.bobot_balanced"
        : "c.bobot_visual, c.bobot_auditori, c.bobot_kinestetik";

    // Fetch basic test information first
    const tests = await db.query(`SELECT * FROM ${testTable} WHERE id = ?`, [
      testId,
    ]);

    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Test not found",
      });
    }

    const testInfo = tests[0];

    // Execute Optimized Query: JOIN Questions with Choices
    // This retrieves all questions and their corresponding choices in one go
    const query = `
      SELECT 
        q.id AS question_id, 
        q.question, 
        c.id AS choice_id, 
        c.option_text,
        ${weightColumns}
      FROM ${questionTable} q
      LEFT JOIN ${choiceTable} c ON q.id = c.soal_id
      WHERE q.test_id = ?
      ORDER BY q.id ASC, c.id ASC
    `;

    const rows = await db.query(query, [testId]);

    // Transform flat SQL rows into a nested JSON structure (Grouping)
    const questionsMap = new Map();

    rows.forEach((row) => {
      // Initialize question entry if not already present in the map
      if (!questionsMap.has(row.question_id)) {
        questionsMap.set(row.question_id, {
          id: row.question_id,
          question: row.question,
          choices: [],
        });
      }

      // Append choice data to the current question if it exists
      if (row.choice_id) {
        const choiceData = {
          id: row.choice_id,
          option_text: row.option_text,
          weights: {}, // Prepare weights object
        };

        // Populate weights based on test type
        if (testType === "pola") {
          choiceData.weights = {
            consistent: row.bobot_consistent,
            fast: row.bobot_fast,
            reflective: row.bobot_reflective,
            balanced: row.bobot_balanced,
          };
        } else {
          choiceData.weights = {
            visual: row.bobot_visual,
            auditori: row.bobot_auditori,
            kinestetik: row.bobot_kinestetik,
          };
        }

        questionsMap.get(row.question_id).choices.push(choiceData);
      }
    });

    // Combine test metadata with the structured questions array
    const result = {
      ...testInfo,
      questions: Array.from(questionsMap.values()),
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTestList,
  getTestById,
};
