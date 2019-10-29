const express = require('express');
const authorize = require('../middleware/authorize');
const authService = require('../services/auth');
const NotifyResult = require('../http/NotifyResult');
const JsonResult = require('../http/JsonResult');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.json(new NotifyResult('Registered successfully'));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    const token = authService.getToken(user, req.app.get('secret'));
    res.header('Authorization', token);
    res.json(new NotifyResult('Login Successful!'));
  } catch (err) {
    next(err);
  }
});

router.get('/user', authorize, async (req, res, next) => {
  try {
    const user = await authService.findUserById(req.user.id);
    res.json(new JsonResult({ user }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
