const db = require('../db/connection');

/**
 * Get all tests of a specific type (pola or gaya)
 * Requirements: 4.1, 4.2, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with req.params.type
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestList(req, res, next) {
  try {
    const testType = req.params.type; // 'pola' or 'gaya'
    
    // Validate test type
    if (testType !== 'pola' && testType !== 'gaya') {
      return res.status(400).json({
        success: false,
        error: 'Invalid test type. Must be "pola" or "gaya"'
      });
    }
    
    // Query tests by type
    const tableName = testType === 'pola' ? 'test_pola' : 'test_gaya';
    const tests = await db.query(`SELECT * FROM ${tableName}`);
    
    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get individual test with nested questions and choices
 * Requirements: 4.1, 4.3, 4.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with req.params.type and req.params.id
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTestById(req, res, next) {
  try {
    const testType = req.params.type; // 'pola' or 'gaya'
    const testId = req.params.id;
    
    // Validate test type
    if (testType !== 'pola' && testType !== 'gaya') {
      return res.status(400).json({
        success: false,
        error: 'Invalid test type. Must be "pola" or "gaya"'
      });
    }
    
    // Determine table names based on test type
    const testTable = testType === 'pola' ? 'test_pola' : 'test_gaya';
    const questionTable = testType === 'pola' ? 'soal_pola' : 'soal_gaya';
    const choiceTable = testType === 'pola' ? 'pilihan_pola' : 'pilihan_gaya';
    
    // Get test details
    const tests = await db.query(`SELECT * FROM ${testTable} WHERE id = ?`, [testId]);
    
    // Return 404 if test not found
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    const test = tests[0];
    
    // Get questions for this test
    const questions = await db.query(`SELECT * FROM ${questionTable} WHERE test_id = ?`, [testId]);
    
    // Get choices for each question
    for (let question of questions) {
      const choices = await db.query(`SELECT * FROM ${choiceTable} WHERE soal_id = ?`, [question.id]);
      question.choices = choices;
    }
    
    test.questions = questions;
    
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTestList,
  getTestById
};
