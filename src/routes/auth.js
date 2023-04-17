const User = require('../models/user');

const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 *
 */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { pageTitle: 'Signup' });
});

/**
 *
 */
router.post('/signup', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    User.register({ email }, password);
    res.redirect('/');
  } catch (error) {
    return next(error);
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { pageTitle: 'Login' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    keepSessionInfo: true,
  }),
  (req, res, next) => {
    if (req.user) {
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
      } else {
        res.redirect('/');
      }
    }
  }
);

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
