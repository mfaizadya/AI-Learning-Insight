const express = require('express');
const router = express.Router();
const testsController = require('../controllers/testsController');

// GET /api/tests/pola - Get all test_pola records
router.get('/pola', (req, res, next) => {
  req.params.type = 'pola';
  testsController.getTestList(req, res, next);
});

// GET /api/tests/pola/:id - Get test_pola with questions and choices
router.get('/pola/:id', (req, res, next) => {
  req.params.type = 'pola';
  testsController.getTestById(req, res, next);
});

// GET /api/tests/gaya - Get all test_gaya records
router.get('/gaya', (req, res, next) => {
  req.params.type = 'gaya';
  testsController.getTestList(req, res, next);
});

// GET /api/tests/gaya/:id - Get test_gaya with questions and choices
router.get('/gaya/:id', (req, res, next) => {
  req.params.type = 'gaya';
  testsController.getTestById(req, res, next);
});

module.exports = router;
