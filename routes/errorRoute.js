const express = require('express');
const router = express.Router();

router.get('/error-test', (req, res, next) => {
  try {
    // Intentional error
    throw new Error('This is a test error');
  } catch (error) {
    next(error);
  }
});

module.exports = router;