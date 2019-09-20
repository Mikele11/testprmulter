const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
var post = require('./routes/post');
var auth = require('./routes/auth');
var app = express();

mongoose.Promise = require('bluebird');
//mongodb://localhost/mern-b
mongoose.connect('mongodb://Mikele11:face112358@ds255262.mlab.com:55262/mern-redux', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/post', post);
app.use('/api/auth', auth);

app.use('/api',(req, res, next) => {
	const timeInMs = Date.now();
	if (req.user) {
		if (((req.user.exp-timeInMs) < 1000)) {
			const token = jwt.sign(req.user.toJSON(), config.secretHashEmail, { expiresIn: '7d' });
			const jwtToken = 'JWT ' + token;
			res.cookie('token', jwtToken, { httpOnly: false });
			res.end();
		}
	} else {
		next();
	}
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
var flash = require('express-flash');
app.use(flash());

app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json ({error: err})
});

module.exports = app;
