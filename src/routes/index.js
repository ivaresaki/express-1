const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');

router.get('/', (req, res, next) => {
  res.render('index', { pageTitle: 'Home' });
});

router.get('/about', connectEnsureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('about', { pageTitle: 'About' });
});

module.exports = router;
