const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/auth"); // Menggunakan middleware yang benar

/**
 * @route   GET /api/dashboard
 * @desc    Retrieve all aggregated data for the user dashboard (Pola, Gaya, Stats, Insights).
 * @access  Private (Requires JWT verification)
 */
router.get("/", verifyToken, dashboardController.getDashboardData);

module.exports = router;
