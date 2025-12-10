const db = require('../db/connection');

/**
 * Submit pola test answers
 * Requirements: 5.1, 5.2, 5.5, 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * Validates answers, uses database transactions, calculates weights,
 * and updates user learning profile
 * 
 * @param {Object} req - Express request object with req.user and req.body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function submitPolaTest(req, res, next) {
  let connection;
  
  try {
    const { test_id, answers } = req.body;
    const userId = req.user.id;
    
    // Validate test_id and answers array
    if (!test_id || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'test_id and answers array are required',
        details: [
          !test_id && 'test_id is required',
          (!answers || !Array.isArray(answers)) && 'answers must be an array',
          (Array.isArray(answers) && answers.length === 0) && 'answers array cannot be empty'
        ].filter(Boolean)
      });
    }
    
    // Verify all soal_id and pilihan_id exist
    for (const answer of answers) {
      if (!answer.soal_id || !answer.pilihan_id) {
        return res.status(400).json({
          success: false,
          error: 'Each answer must have soal_id and pilihan_id'
        });
      }
      
      // Verify soal exists and belongs to the test
      const soal = await db.query(
        'SELECT id FROM soal_pola WHERE id = ? AND test_id = ?',
        [answer.soal_id, test_id]
      );
      
      if (soal.length === 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid soal_id ${answer.soal_id} for test ${test_id}`
        });
      }
      
      // Verify pilihan exists and belongs to the soal
      const pilihan = await db.query(
        'SELECT id FROM pilihan_pola WHERE id = ? AND soal_id = ?',
        [answer.pilihan_id, answer.soal_id]
      );
      
      if (pilihan.length === 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid pilihan_id ${answer.pilihan_id} for soal ${answer.soal_id}`
        });
      }
    }
    
    // Begin database transaction
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    // Insert hasil_test record with current timestamp
    const [hasilTestResult] = await connection.execute(
      'INSERT INTO hasil_test (user_id, test_pola_id, timestamp) VALUES (?, ?, NOW())',
      [userId, test_id]
    );
    
    const hasilTestId = hasilTestResult.insertId;
    
    // Initialize weight totals for each dimension
    const weightTotals = {
      consistent: 0,
      fast: 0,
      reflective: 0,
      balanced: 0
    };
    
    // Insert all answers into hasil_test_pola_detail with weights
    for (const answer of answers) {
      // Get the weights from pilihan_pola
      const [pilihan] = await connection.query(
        'SELECT bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced FROM pilihan_pola WHERE id = ?',
        [answer.pilihan_id]
      );
      
      const weights = pilihan[0];
      
      // Insert detail record
      await connection.execute(
        `INSERT INTO hasil_test_pola_detail 
         (hasil_test_id, soal_id, pilihan_id, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          hasilTestId,
          answer.soal_id,
          answer.pilihan_id,
          weights.bobot_consistent,
          weights.bobot_fast,
          weights.bobot_reflective,
          weights.bobot_balanced
        ]
      );
      
      // Calculate total weights for each dimension
      weightTotals.consistent += weights.bobot_consistent;
      weightTotals.fast += weights.bobot_fast;
      weightTotals.reflective += weights.bobot_reflective;
      weightTotals.balanced += weights.bobot_balanced;
    }
    
    // Update user learning_pattern based on highest weight
    const maxWeight = Math.max(
      weightTotals.consistent,
      weightTotals.fast,
      weightTotals.reflective,
      weightTotals.balanced
    );
    
    let learningPattern;
    if (weightTotals.consistent === maxWeight) {
      learningPattern = 'consistent';
    } else if (weightTotals.fast === maxWeight) {
      learningPattern = 'fast';
    } else if (weightTotals.reflective === maxWeight) {
      learningPattern = 'reflective';
    } else {
      learningPattern = 'balanced';
    }
    
    await connection.execute(
      'UPDATE users SET learning_pattern = ? WHERE id = ?',
      [learningPattern, userId]
    );
    
    // Commit transaction
    await connection.commit();
    
    // Return created result ID
    res.status(201).json({
      success: true,
      data: {
        hasil_test_id: hasilTestId,
        learning_pattern: learningPattern,
        weight_totals: weightTotals
      }
    });
    
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Submit gaya test answers
 * Requirements: 5.1, 5.2, 5.5, 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * Validates answers, uses database transactions, calculates weights,
 * and updates user learning style
 * 
 * @param {Object} req - Express request object with req.user and req.body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function submitGayaTest(req, res, next) {
  let connection;
  
  try {
    const { test_id, answers } = req.body;
    const userId = req.user.id;
    
    // Validate test_id and answers array
    if (!test_id || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'test_id and answers array are required',
        details: [
          !test_id && 'test_id is required',
          (!answers || !Array.isArray(answers)) && 'answers must be an array',
          (Array.isArray(answers) && answers.length === 0) && 'answers array cannot be empty'
        ].filter(Boolean)
      });
    }
    
    // Verify all soal_id and pilihan_id exist
    for (const answer of answers) {
      if (!answer.soal_id || !answer.pilihan_id) {
        return res.status(400).json({
          success: false,
          error: 'Each answer must have soal_id and pilihan_id'
        });
      }
      
      // Verify soal exists and belongs to the test
      const soal = await db.query(
        'SELECT id FROM soal_gaya WHERE id = ? AND test_id = ?',
        [answer.soal_id, test_id]
      );
      
      if (soal.length === 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid soal_id ${answer.soal_id} for test ${test_id}`
        });
      }
      
      // Verify pilihan exists and belongs to the soal
      const pilihan = await db.query(
        'SELECT id FROM pilihan_gaya WHERE id = ? AND soal_id = ?',
        [answer.pilihan_id, answer.soal_id]
      );
      
      if (pilihan.length === 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid pilihan_id ${answer.pilihan_id} for soal ${answer.soal_id}`
        });
      }
    }
    
    // Begin database transaction
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    // Insert hasil_test record with current timestamp
    const [hasilTestResult] = await connection.execute(
      'INSERT INTO hasil_test (user_id, test_gaya_id, timestamp) VALUES (?, ?, NOW())',
      [userId, test_id]
    );
    
    const hasilTestId = hasilTestResult.insertId;
    
    // Initialize weight totals for each dimension
    const weightTotals = {
      visual: 0,
      auditori: 0,
      kinestetik: 0
    };
    
    // Insert all answers into hasil_test_gaya_detail with weights
    for (const answer of answers) {
      // Get the weights from pilihan_gaya
      const [pilihan] = await connection.query(
        'SELECT bobot_visual, bobot_auditori, bobot_kinestetik FROM pilihan_gaya WHERE id = ?',
        [answer.pilihan_id]
      );
      
      const weights = pilihan[0];
      
      // Insert detail record
      await connection.execute(
        `INSERT INTO hasil_test_gaya_detail 
         (hasil_test_id, soal_id, pilihan_id, bobot_visual, bobot_auditori, bobot_kinestetik) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          hasilTestId,
          answer.soal_id,
          answer.pilihan_id,
          weights.bobot_visual,
          weights.bobot_auditori,
          weights.bobot_kinestetik
        ]
      );
      
      // Calculate total weights for each dimension
      weightTotals.visual += weights.bobot_visual;
      weightTotals.auditori += weights.bobot_auditori;
      weightTotals.kinestetik += weights.bobot_kinestetik;
    }
    
    // Update user learning_style based on highest weight
    const maxWeight = Math.max(
      weightTotals.visual,
      weightTotals.auditori,
      weightTotals.kinestetik
    );
    
    let learningStyle;
    if (weightTotals.visual === maxWeight) {
      learningStyle = 'visual';
    } else if (weightTotals.auditori === maxWeight) {
      learningStyle = 'auditori';
    } else {
      learningStyle = 'kinestetik';
    }
    
    await connection.execute(
      'UPDATE users SET learning_style = ? WHERE id = ?',
      [learningStyle, userId]
    );
    
    // Commit transaction
    await connection.commit();
    
    // Return created result ID
    res.status(201).json({
      success: true,
      data: {
        hasil_test_id: hasilTestId,
        learning_style: learningStyle,
        weight_totals: weightTotals
      }
    });
    
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Get user's test history
 * Requirements: 5.1, 5.3, 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * Retrieves all test results for the authenticated user
 * 
 * @param {Object} req - Express request object with req.user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestHistory(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Query all hasil_test for the user with test names
    const history = await db.query(
      `SELECT 
        ht.id,
        ht.timestamp,
        tp.name as test_name,
        'pola' as test_type
      FROM hasil_test ht
      LEFT JOIN test_pola tp ON ht.test_pola_id = tp.id
      WHERE ht.user_id = ? AND ht.test_pola_id IS NOT NULL
      
      UNION ALL
      
      SELECT 
        ht.id,
        ht.timestamp,
        tg.name as test_name,
        'gaya' as test_type
      FROM hasil_test ht
      LEFT JOIN test_gaya tg ON ht.test_gaya_id = tg.id
      WHERE ht.user_id = ? AND ht.test_gaya_id IS NOT NULL
      
      ORDER BY timestamp DESC`,
      [userId, userId]
    );
    
    // Return array (empty if no history)
    res.json({
      success: true,
      data: history
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get specific test result details
 * Requirements: 5.1, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * Retrieves detailed result with nested answer data,
 * verifies ownership and enforces authorization
 * 
 * @param {Object} req - Express request object with req.user and req.params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestResultById(req, res, next) {
  try {
    const resultId = req.params.id;
    const userId = req.user.id;
    
    // Query hasil_test by ID
    const [hasilTest] = await db.query(
      `SELECT 
        ht.id,
        ht.user_id,
        ht.test_pola_id,
        ht.test_gaya_id,
        ht.timestamp,
        tp.name as test_pola_name,
        tg.name as test_gaya_name
      FROM hasil_test ht
      LEFT JOIN test_pola tp ON ht.test_pola_id = tp.id
      LEFT JOIN test_gaya tg ON ht.test_gaya_id = tg.id
      WHERE ht.id = ?`,
      [resultId]
    );
    
    // Check if result exists
    if (!hasilTest) {
      return res.status(404).json({
        success: false,
        error: 'Test result not found'
      });
    }
    
    // Verify result belongs to the authenticated user (authorization check)
    if (hasilTest.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: This result belongs to another user'
      });
    }
    
    let resultDetails;
    
    // Check if this is a pola test result
    if (hasilTest.test_pola_id) {
      // Get all answers with question and choice text
      const answers = await db.query(
        `SELECT 
          htpd.id,
          htpd.soal_id,
          htpd.pilihan_id,
          htpd.bobot_consistent,
          htpd.bobot_fast,
          htpd.bobot_reflective,
          htpd.bobot_balanced,
          sp.question,
          pp.option_text
        FROM hasil_test_pola_detail htpd
        JOIN soal_pola sp ON htpd.soal_id = sp.id
        JOIN pilihan_pola pp ON htpd.pilihan_id = pp.id
        WHERE htpd.hasil_test_id = ?
        ORDER BY htpd.soal_id`,
        [resultId]
      );
      
      resultDetails = {
        id: hasilTest.id,
        user_id: hasilTest.user_id,
        test_type: 'pola',
        test_name: hasilTest.test_pola_name,
        timestamp: hasilTest.timestamp,
        answers: answers
      };
    } 
    // Check if this is a gaya test result
    else if (hasilTest.test_gaya_id) {
      // Get all answers with question and choice text
      const answers = await db.query(
        `SELECT 
          htgd.id,
          htgd.soal_id,
          htgd.pilihan_id,
          htgd.bobot_visual,
          htgd.bobot_auditori,
          htgd.bobot_kinestetik,
          sg.question,
          pg.option_text
        FROM hasil_test_gaya_detail htgd
        JOIN soal_gaya sg ON htgd.soal_id = sg.id
        JOIN pilihan_gaya pg ON htgd.pilihan_id = pg.id
        WHERE htgd.hasil_test_id = ?
        ORDER BY htgd.soal_id`,
        [resultId]
      );
      
      resultDetails = {
        id: hasilTest.id,
        user_id: hasilTest.user_id,
        test_type: 'gaya',
        test_name: hasilTest.test_gaya_name,
        timestamp: hasilTest.timestamp,
        answers: answers
      };
    }
    
    // Return complete nested result structure
    res.json({
      success: true,
      data: resultDetails
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitPolaTest,
  submitGayaTest,
  getTestHistory,
  getTestResultById
};
