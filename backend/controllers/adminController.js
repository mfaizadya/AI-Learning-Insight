const db = require('../db/connection');

/**
 * Create question for test_pola (admin only)
 * Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with test_id and question in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createPolaQuestion(req, res, next) {
  try {
    const { test_id, question } = req.body;
    
    // Validate test_id and question text
    if (!test_id || !question) {
      return res.status(400).json({
        success: false,
        error: 'test_id and question are required',
        details: [
          !test_id && 'test_id is required',
          !question && 'question is required'
        ].filter(Boolean)
      });
    }
    
    // Verify test_pola exists
    const tests = await db.query(
      'SELECT id FROM test_pola WHERE id = ?',
      [test_id]
    );
    
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Insert soal_pola into database
    const result = await db.execute(
      'INSERT INTO soal_pola (test_id, question) VALUES (?, ?)',
      [test_id, question]
    );
    
    // Return created question
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        test_id,
        question
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Create choice for soal_pola (admin only)
 * Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with soal_id, option_text, and bobot values in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createPolaChoice(req, res, next) {
  try {
    const { 
      soal_id, 
      option_text, 
      bobot_consistent, 
      bobot_fast, 
      bobot_reflective, 
      bobot_balanced 
    } = req.body;
    
    // Validate soal_id, option_text, and all bobot values
    if (!soal_id || !option_text || 
        bobot_consistent === undefined || 
        bobot_fast === undefined || 
        bobot_reflective === undefined || 
        bobot_balanced === undefined) {
      return res.status(400).json({
        success: false,
        error: 'soal_id, option_text, and all bobot values are required',
        details: [
          !soal_id && 'soal_id is required',
          !option_text && 'option_text is required',
          bobot_consistent === undefined && 'bobot_consistent is required',
          bobot_fast === undefined && 'bobot_fast is required',
          bobot_reflective === undefined && 'bobot_reflective is required',
          bobot_balanced === undefined && 'bobot_balanced is required'
        ].filter(Boolean)
      });
    }
    
    // Verify soal_pola exists
    const soals = await db.query(
      'SELECT id FROM soal_pola WHERE id = ?',
      [soal_id]
    );
    
    if (soals.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    // Insert pilihan_pola into database
    const result = await db.execute(
      `INSERT INTO pilihan_pola 
       (soal_id, option_text, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [soal_id, option_text, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced]
    );
    
    // Return created choice
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        soal_id,
        option_text,
        bobot_consistent,
        bobot_fast,
        bobot_reflective,
        bobot_balanced
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Create question for test_gaya (admin only)
 * Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with test_id and question in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createGayaQuestion(req, res, next) {
  try {
    const { test_id, question } = req.body;
    
    // Validate test_id and question text
    if (!test_id || !question) {
      return res.status(400).json({
        success: false,
        error: 'test_id and question are required',
        details: [
          !test_id && 'test_id is required',
          !question && 'question is required'
        ].filter(Boolean)
      });
    }
    
    // Verify test_gaya exists
    const tests = await db.query(
      'SELECT id FROM test_gaya WHERE id = ?',
      [test_id]
    );
    
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Insert soal_gaya into database
    const result = await db.execute(
      'INSERT INTO soal_gaya (test_id, question) VALUES (?, ?)',
      [test_id, question]
    );
    
    // Return created question
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        test_id,
        question
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Create choice for soal_gaya (admin only)
 * Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with soal_id, option_text, and bobot values in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createGayaChoice(req, res, next) {
  try {
    const { 
      soal_id, 
      option_text, 
      bobot_visual, 
      bobot_auditori, 
      bobot_kinestetik 
    } = req.body;
    
    // Validate soal_id, option_text, and all bobot values
    if (!soal_id || !option_text || 
        bobot_visual === undefined || 
        bobot_auditori === undefined || 
        bobot_kinestetik === undefined) {
      return res.status(400).json({
        success: false,
        error: 'soal_id, option_text, and all bobot values are required',
        details: [
          !soal_id && 'soal_id is required',
          !option_text && 'option_text is required',
          bobot_visual === undefined && 'bobot_visual is required',
          bobot_auditori === undefined && 'bobot_auditori is required',
          bobot_kinestetik === undefined && 'bobot_kinestetik is required'
        ].filter(Boolean)
      });
    }
    
    // Verify soal_gaya exists
    const soals = await db.query(
      'SELECT id FROM soal_gaya WHERE id = ?',
      [soal_id]
    );
    
    if (soals.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    // Insert pilihan_gaya into database
    const result = await db.execute(
      `INSERT INTO pilihan_gaya 
       (soal_id, option_text, bobot_visual, bobot_auditori, bobot_kinestetik) 
       VALUES (?, ?, ?, ?, ?)`,
      [soal_id, option_text, bobot_visual, bobot_auditori, bobot_kinestetik]
    );
    
    // Return created choice
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        soal_id,
        option_text,
        bobot_visual,
        bobot_auditori,
        bobot_kinestetik
      }
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPolaQuestion,
  createPolaChoice,
  createGayaQuestion,
  createGayaChoice
};
