const path = require('path');
require('dotenv').config({path: __dirname + '/.env'});

const createError = require('http-errors'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  io = require('./socket_api'),
  mongoose = require('mongoose'),
  indexRouter = require('./routes/index'),
  adminRouter = require('./routes/admin'),
  airdropRouter = require('./routes/airdrop');

const app = express();

app.io = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/prodeth');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected');
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/airdrop', airdropRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
