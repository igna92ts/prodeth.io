const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  io = require('./socket_api'),
  mongoose = require('mongoose'),
  indexRouter = require('./routes/index'),
  ethscanService = require('./services/ethscan_service');

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
  // create match method
  ethscanService.createMatch('RUS', 'KSA', '2018-06-14 18:00', 'Europe/Moscow');
  ethscanService.createMatch('EGY', 'URU', '2018-06-15 17:00', 'Europe/Ekaterinburg');
  ethscanService.createMatch('MAR', 'IRN', '2018-06-15 18:00', 'Asia/St_Petersburg');
  ethscanService.createMatch('POR', 'ESP', '2018-06-15 21:00', 'Asia/Sochi');
  ethscanService.createMatch('FRA', 'AUS', '2018-06-16 13:00', 'Asia/Kazan');
  ethscanService.createMatch('ARG', 'ISL', '2018-06-16 16:00', 'Europe/Moscow');
  ethscanService.createMatch('PER', 'DEN', '2018-06-16 19:00', 'Asia/Saransk');
  ethscanService.createMatch('CRO', 'NGA', '2018-06-16 21:00', 'Europe/Kaliningrad');
  ethscanService.createMatch('CRC', 'SRB', '2018-06-17 16:00', 'Asia/Samara');
  ethscanService.createMatch('GER', 'MEX', '2018-06-17 18:00', 'Europe/Moscow');
  ethscanService.createMatch('BRA', 'SUI', '2018-06-17 21:00', 'Asia/Rostov-On-Don');
  ethscanService.createMatch('SWE', 'KOR', '2018-06-18 15:00', 'Asia/Nizhny_Novgorod');
  ethscanService.createMatch('BEL', 'PAN', '2018-06-18 18:00', 'Asia/Sochi');
  ethscanService.createMatch('TUN', 'ENG', '2018-06-18 21:00', 'Europe/Volgograd');
  ethscanService.createMatch('COL', 'JPN', '2018-06-19 15:00', 'Asia/Saransk');
  ethscanService.createMatch('POL', 'SEN', '2018-06-19 18:00', 'Europe/Moscow');
  ethscanService.createMatch('RUS', 'EGY', '2018-06-19 21:00', 'Asia/St_Petersburg');
});

app.use('/', indexRouter);

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
