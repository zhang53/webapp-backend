const express = require('express');
const authorize = require('../middleware/authorize');
const { getAuthToken } = require('../utils/helper');
const JsonResult = require('../results/json');
const NotifyResult = require('../results/notify');
const AuthService = require('../services/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const authService = new AuthService();
    await authService.register(req.body);
    res.json(new NotifyResult('Registered successfully'));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const authService = new AuthService();
    const user = await authService.login(req.body);
    const token = getAuthToken(user, req.app.get('secret'));
    res.header('Authorization', token);
    res.json(new NotifyResult('Login Successful!'));
  } catch (err) {
    next(err);
  }
});

router.get('/refresh', authorize, async (req, res, next) => {
  try {
    const authService = new AuthService();
    const user = await authService.findUserById(req.user.id);
    const token = getAuthToken(user, req.app.get('secret'));
    res.header('Authorization', token);
    res.send();
  } catch (err) {
    next(err);
  }
});

router.get('/user', authorize, async (req, res, next) => {
  try {
    const authService = new AuthService();
    const data = await authService.findUserById(req.user.id);
    res.json(new JsonResult({ data }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
