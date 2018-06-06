require('dotenv').config();

const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  io = require('./socket_api'),
  mongoose = require('mongoose'),
  indexRouter = require('./routes/index'),
  adminRouter = require('./routes/admin'),
  matchService = require('./services/matches');

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
db.once('open', async () => {
  // create match method
  try {
    /*
    await matchService.createMatch('RUS', 'KSA', '2018-06-14 18:00', 'Europe/Moscow');
    await matchService.createMatch('EGY', 'URU', '2018-06-15 17:00', 'Asia/Yekaterinburg');
    await matchService.createMatch('MAR', 'IRN', '2018-06-15 18:00', 'Europe/Moscow');
    await matchService.createMatch('POR', 'ESP', '2018-06-15 21:00', 'Europe/Moscow');
    await matchService.createMatch('FRA', 'AUS', '2018-06-16 13:00', 'Europe/Moscow');
    await matchService.createMatch('ARG', 'ISL', '2018-06-16 16:00', 'Europe/Moscow');
    await matchService.createMatch('PER', 'DEN', '2018-06-16 19:00', 'Europe/Moscow');
    await matchService.createMatch('CRO', 'NGA', '2018-06-16 21:00', 'Europe/Kaliningrad');
    await matchService.createMatch('CRC', 'SRB', '2018-06-17 16:00', 'Europe/Samara');
    await matchService.createMatch('GER', 'MEX', '2018-06-17 18:00', 'Europe/Moscow');
    await matchService.createMatch('BRA', 'SUI', '2018-06-17 21:00', 'Europe/Moscow');
    await matchService.createMatch('SWE', 'KOR', '2018-06-18 15:00', 'Europe/Moscow');
    await matchService.createMatch('BEL', 'PAN', '2018-06-18 18:00', 'Europe/Moscow');
    await matchService.createMatch('TUN', 'ENG', '2018-06-18 21:00', 'Europe/Moscow');
    await matchService.createMatch('COL', 'JPN', '2018-06-19 15:00', 'Europe/Moscow');
    await matchService.createMatch('POL', 'SEN', '2018-06-19 18:00', 'Europe/Moscow');
    await matchService.createMatch('RUS', 'EGY', '2018-06-19 21:00', 'Europe/Moscow');
    */
  } catch (err) {
    console.log(err);
  }
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
