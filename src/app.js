const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config/app');
const sendError = require('./config/errors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

// config setup
app.set('secret', config.secret);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
}));

// routes setup
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  next(sendError(err, res));
});

module.exports = app;
