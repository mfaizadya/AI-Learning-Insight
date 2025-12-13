const express = require("express");
const router = express.Router();
const testsController = require("../controllers/testsController");

/**
 * @route   GET /api/tests/:type
 * @desc    Retrieve a list of available tests by type ('pola' or 'gaya')
 * @param   {string} type - The category of the test
 * @access  Public
 */
router.get("/:type", testsController.getTestList);

/**
 * @route   GET /api/tests/:type/:id
 * @desc    Retrieve a specific test including all nested questions and choices
 * @param   {string} type - The category of the test ('pola' or 'gaya')
 * @param   {number} id   - The unique identifier of the test
 * @access  Public
 */
router.get("/:type/:id", testsController.getTestById);

module.exports = router;
