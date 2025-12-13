const axios = require("axios");
const db = require("../db/connection");

/**
 * Helper function to get the next ID manually
 * Used to handle databases without AUTO_INCREMENT on specific tables
 */
async function getNextId(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT MAX(id) as max_id FROM ${tableName}`
  );
  const currentMax = rows[0].max_id || 0;
  return currentMax + 1;
}

/**
 * Submit Learning Pattern (POLA) Test Results
 * Logic:
 * 1. Validates answers
 * 2. Fetches weights from DB
 * 3. Calculates 9 Features for ML (Total & Average)
 * 4. Sends features to Heroku ML Model
 * 5. Saves result to DB (Header & Details) using Manual ID
 * 6. Updates User Profile
 */
async function submitPolaResult(req, res, next) {
  let connection;
  try {
    // Determine the user ID from the authentication token or request body for testing purposes
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.body.user_id) {
      userId = req.body.user_id;
    }

    // Terminate if no valid user ID is found
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID is missing.",
      });
    }

    const { test_id, answers } = req.body;

    // Validate the presence of the test ID
    if (!test_id) {
      return res.status(400).json({
        success: false,
        error: "Missing 'test_id'.",
      });
    }

    // Ensure answers are provided in a valid array format
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or empty 'answers'.",
      });
    }

    // Extract choice IDs to query weights
    const choiceIds = answers.map((a) => a.pilihan_id);

    // Prepare query to fetch weights for the selected choices
    const queryChoices = `
       SELECT p.id, p.soal_id, p.bobot_consistent, p.bobot_fast, p.bobot_reflective, p.bobot_balanced 
       FROM pilihan_pola p
       WHERE p.id IN (?)
    `;

    // Execute database query
    let choicesData = await db.query(queryChoices, [choiceIds]);

    // Handle potential differences in database driver response formats
    const choices = Array.isArray(choicesData[0])
      ? choicesData[0]
      : choicesData;

    // Validate data integrity: checks if all submitted choice IDs exist in the database
    if (choices.length !== new Set(choiceIds).size) {
      return res.status(400).json({
        success: false,
        error:
          "One or more 'pilihan_id' are invalid or do not exist in database.",
      });
    }

    // Initialize variables for feature extraction and scoring
    const features = [];
    const totalScores = { consistent: 0, fast: 0, reflective: 0, balanced: 0 };
    const missingQuestions = [];

    // Loop through question IDs 1 to 9 to construct ordered features
    for (let i = 1; i <= 9; i++) {
      const selectedChoice = choices.find((c) => c.soal_id === i);

      if (selectedChoice) {
        // Sum weights to get the active value for the ML model
        const val =
          selectedChoice.bobot_consistent +
          selectedChoice.bobot_fast +
          selectedChoice.bobot_reflective +
          selectedChoice.bobot_balanced;

        features.push(val);

        // Accumulate scores for the response payload
        totalScores.consistent += selectedChoice.bobot_consistent;
        totalScores.fast += selectedChoice.bobot_fast;
        totalScores.reflective += selectedChoice.bobot_reflective;
        totalScores.balanced += selectedChoice.bobot_balanced;
      } else {
        // Handle cases where a question was skipped
        features.push(0);
        missingQuestions.push(i);
      }
    }

    // Block submission if the dataset is incomplete
    if (missingQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Incomplete answers. Missing question IDs: ${missingQuestions.join(
          ", "
        )}`,
      });
    }

    // Process prediction via external Machine Learning service
    let predictionLabel = "Unknown";

    try {
      if (!process.env.ML_ENDPOINT) {
        throw new Error("ML_ENDPOINT is not defined in environment variables");
      }

      const mlApiUrl = `${process.env.ML_ENDPOINT}/predict`;

      // Call ML API with a timeout to prevent hanging requests
      const mlResponse = await axios.post(
        mlApiUrl,
        { features: features },
        { timeout: 60000 }
      );

      // Parse prediction result
      if (mlResponse.data && mlResponse.data.prediction_label) {
        predictionLabel = Array.isArray(mlResponse.data.prediction_label)
          ? mlResponse.data.prediction_label[0]
          : mlResponse.data.prediction_label;
      } else {
        console.warn(
          "Warning: ML API returned unexpected format",
          mlResponse.data
        );
      }
    } catch (mlError) {
      console.error("ML Service Error:", mlError.message);

      // Return 503 Service Unavailable if critical ML dependency fails
      return res.status(503).json({
        success: false,
        error:
          "AI Prediction Service is currently unavailable. Please try again later.",
      });
    }

    // Begin database transaction for atomic operations
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insert the test result header
    const [headerResult] = await connection.execute(
      `INSERT INTO hasil_test (user_id, test_pola_id, timestamp) VALUES (?, ?, NOW())`,
      [userId, test_id]
    );

    if (headerResult.affectedRows === 0) {
      throw new Error("Failed to insert test header.");
    }
    const resultId = headerResult.insertId;

    // Prepare bulk insert data for test details
    const detailValues = choices.map((c) => [
      resultId,
      c.soal_id,
      c.id,
      c.bobot_consistent,
      c.bobot_fast,
      c.bobot_reflective,
      c.bobot_balanced,
    ]);

    // Perform bulk insert of details
    if (detailValues.length > 0) {
      await connection.query(
        `INSERT INTO hasil_test_pola_detail 
           (hasil_test_id, soal_id, pilihan_id, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced) 
           VALUES ?`,
        [detailValues]
      );
    }

    // Update user profile with the predicted learning pattern
    const dbLabel = predictionLabel.toLowerCase().split(" ")[0];
    const [updateResult] = await connection.execute(
      `UPDATE users SET learning_pattern = ? WHERE id = ?`,
      [dbLabel, userId]
    );

    // Verify user update success
    if (updateResult.affectedRows === 0) {
      throw new Error(`User with ID ${userId} not found during update.`);
    }

    // Commit transaction
    await connection.commit();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Test submitted successfully",
      data: {
        result_id: resultId,
        learning_pattern: predictionLabel,
        scores: totalScores,
      },
    });
  } catch (error) {
    // Rollback transaction in case of any failure
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    console.error("Submit Pola Result Error:", error);

    // Determine appropriate status code and error message
    // Handle database foreign key constraints (e.g., invalid test_id)
    if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid reference: The provided test_id or user_id does not exist.",
      });
    }

    const status = error.statusCode || 500;

    // Avoid leaking internal logic errors to the client in production, unless it's a known error
    const message =
      error.message.includes("User with ID") ||
      error.message.includes("ML_ENDPOINT")
        ? error.message
        : "Internal Server Error";

    res.status(status).json({
      success: false,
      error: message,
    });

    next(error);
  } finally {
    // Ensure database connection is released back to the pool
    if (connection) connection.release();
  }
}

/**
 * Submit Learning Style (GAYA) Test Results
 * Logic:
 * 1. Validates answers
 * 2. Fetches weights from DB
 * 3. Calculates Totals manually
 * 4. Determines Dominant Style (Visual/Auditory/Kinesthetic)
 * 5. Saves result to DB (Header & Details) using Manual ID
 * 6. Updates User Profile
 */
async function submitGayaResult(req, res, next) {
  let connection;
  try {
    // 1. Security & Authentication Check
    // Determine user ID from Token (Production) or Body (Testing)
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
      // console.log("user aidi: ", userId);
      
    } else if (req.body.user_id) {
      userId = req.body.user_id;
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID is missing.",
      });
    }

    const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);

    // Handle array destructuring safety
    const userFound = Array.isArray(userExists) ? userExists : [userExists];

    if (userFound.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} does not exist in the database.`,
      });
    }

    const { test_id, answers } = req.body;

    // 2. Input Validation
    if (!test_id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing 'test_id'." });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or empty 'answers'." });
    }

    // 3. Fetch Weights from Database
    const choiceIds = answers.map((a) => a.pilihan_id);

    const queryChoices = `
       SELECT id, soal_id, bobot_visual, bobot_auditori, bobot_kinestetik 
       FROM pilihan_gaya 
       WHERE id IN (?)
    `;

    // Execute query
    let choicesData = await db.query(queryChoices, [choiceIds]);

    // Handle potential driver differences (some return [rows, fields], others just rows)
    const choices = Array.isArray(choicesData[0])
      ? choicesData[0]
      : choicesData;

    // Integrity Check: Ensure all submitted IDs exist in the database
    const uniqueInputIds = new Set(choiceIds);
    if (choices.length !== uniqueInputIds.size) {
      return res.status(400).json({
        success: false,
        error:
          "One or more 'pilihan_id' are invalid or do not exist in the database.",
      });
    }

    // 4. Calculate Scores & Determine Dominant Style
    let totalVisual = 0;
    let totalAuditory = 0;
    let totalKinesthetic = 0;

    // Loop through retrieved choices to sum up weights
    choices.forEach((c) => {
      totalVisual += c.bobot_visual || 0;
      totalAuditory += c.bobot_auditori || 0;
      totalKinesthetic += c.bobot_kinestetik || 0;
    });

    const scores = {
      visual: totalVisual,
      auditori: totalAuditory,
      kinestetik: totalKinesthetic,
    };

    // Algorithm to find the key with the highest value
    // If there is a tie, this logic defaults to the first one encountered in the comparison
    const finalStyle = Object.keys(scores).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );

    // 5. Database Transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // A. Insert Test Result Header
    const [headerResult] = await connection.execute(
      `INSERT INTO hasil_test (user_id, test_gaya_id, timestamp) VALUES (?, ?, NOW())`,
      [userId, test_id]
    );

    if (headerResult.affectedRows === 0) {
      throw new Error("Failed to insert test header.");
    }
    const resultId = headerResult.insertId;

    // B. Insert Test Result Details (Bulk Insert)
    // Map answers to the correct format for bulk insertion
    const detailValues = choices.map((c) => [
      resultId,
      c.soal_id,
      c.id,
      c.bobot_visual,
      c.bobot_auditori,
      c.bobot_kinestetik,
    ]);

    if (detailValues.length > 0) {
      await connection.query(
        `INSERT INTO hasil_test_gaya_detail 
           (hasil_test_id, soal_id, pilihan_id, bobot_visual, bobot_auditori, bobot_kinestetik) 
           VALUES ?`,
        [detailValues]
      );
    }

    // C. Update User Profile
    // Ensure the style matches the ENUM in the database
    const [updateResult] = await connection.execute(
      `UPDATE users SET learning_style = ? WHERE id = ?`,
      [finalStyle, userId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error(`User with ID ${userId} not found during update.`);
    }

    // D. Commit Transaction
    await connection.commit();

    // 6. Success Response
    res.status(201).json({
      success: true,
      data: {
        result_id: resultId,
        learning_style: finalStyle,
        scores: scores,
      },
    });
  } catch (error) {
    // 7. Global Error Handler & Rollback
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    console.error("Submit Gaya Result Error:", error);

    // Differentiate between client errors and internal server errors
    if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid reference: The provided test_id or user_id does not exist.",
      });
    }

    const status = error.statusCode || 500;
    const message = error.message.includes("User with ID")
      ? error.message
      : "Internal Server Error";

    res.status(status).json({
      success: false,
      error: message,
    });

    next(error);
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Get User Test History
 * Logic:
 * Retrieves all test results for the user, joining with test definition tables
 * to provide context (Test Name, Type, etc.)
 */
async function getHistory(req, res, next) {
  try {
    // 1. Security & Authentication Check
    // For GET requests, we prioritize the Token (req.user)
    // We fallback to req.query (URL parameters) for testing: /api/results/history?user_id=1
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.query.user_id) {
      userId = req.query.user_id;
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID is missing.",
      });
    }

    // 2. Prepare SQL Query
    // This query normalizes data from two different test types (Pola vs Gaya) into a single unified format.
    // CASE statement determines 'test_type' based on which foreign key is present.
    // COALESCE selects the non-null test name from the joined tables.
    const query = `
      SELECT 
        h.id, 
        h.timestamp,
        CASE 
          WHEN h.test_pola_id IS NOT NULL THEN 'pola'
          WHEN h.test_gaya_id IS NOT NULL THEN 'gaya'
        END as test_type,
        COALESCE(tp.name, tg.name) as test_name
      FROM hasil_test h
      LEFT JOIN test_pola tp ON h.test_pola_id = tp.id
      LEFT JOIN test_gaya tg ON h.test_gaya_id = tg.id
      WHERE h.user_id = ?
      ORDER BY h.timestamp DESC
    `;

    // 3. Execute Query
    // We use array destructuring [history] to extract the data rows directly, ignoring metadata.
    const history = await db.query(query, [userId]);

    // 4. Success Response
    // Strictly formatted to match your requirement: { success: true, data: [...] }
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get History Error:", error);

    // Standardized error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });

    next(error);
  }
}

module.exports = {
  submitPolaResult,
  submitGayaResult,
  getHistory,
};
