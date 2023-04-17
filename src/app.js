const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const flash = require('connect-flash');
const logger = require('morgan');

const User = require('./models/user');
const passport = require('passport');

// retrieve multipart-form
// need enctype="multipart/form-data" in the <form> tags
const multer = require('multer');

// dotenv config
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger('dev'));

// session
const sessionStore = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

sessionStore.on('error', (err) => {
  console.log(err);
});

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    name: 'my-session-name',
    store: sessionStore,
  })
);

// app attributes

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
    },
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(multer().single('image'));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(passport.authenticate('session'));
// app.use(function(req, res, next) {
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !! msgs.length;
//   req.session.messages = [];
//   next();
// });
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.disable('x-powered-by');
// setup view engine
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// routes
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  } else {
    res.locals.user = {};
  }

  res.locals.errors = req.flash('error');
  res.locals.msg = req.flash('msg');

  next();
});

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
app.use(indexRouter);
app.use(authRouter);
app.use(profileRouter);

// catch all routes
app.use((req, res, next) => {
  res
    .status(404)
    .render('errors/error', { pageTitle: 'Error 404', error: '404' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .render('errors/error', { pageTitle: `Error ${err.status}`, error: '500' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server started http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to database: ${err}`);
  });
