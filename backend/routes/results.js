const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/resultsController");
const { verifyToken } = require("../middleware/auth");

/**
 * @route   POST /api/results/pola
 * @desc    Submit answers for Learning Pattern (POLA) test.
 * Calculates weights and sends data to external ML API for prediction.
 * @access  Private
 */
router.post("/pola", verifyToken, resultsController.submitPolaResult);

/**
 * @route   POST /api/results/gaya
 * @desc    Submit answers for Learning Style (GAYA) test.
 * Calculates weights manually and determines the dominant style.
 * @access  Private
 */
router.post("/gaya", verifyToken, resultsController.submitGayaResult);

/**
 * @route   GET /api/results/history
 * @desc    Retrieve the authenticated user's test history.
 * @access  Private
 */
router.get("/history", verifyToken, resultsController.getHistory);

module.exports = router;
