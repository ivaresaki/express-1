const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');

const User = require('../models/user');

router.get(
  '/profile',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res, next) => {
    User.findOne({ email: req.user.email })
      .then((user) => {
        res.render('profiles/index', { pageTitle: 'Profile', user });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get('/edit', (req, res, next) => {
  const img = req.file;
  console.log(img);
});

module.exports = router;
