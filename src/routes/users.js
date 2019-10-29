const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  try {
    res.send('respond with a resource');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
