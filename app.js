var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var redis = require("redis"),
    client = redis.createClient();
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
var mongoose = require('mongoose');
var config = require('./config'); // get our config file

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: config.user,
  pass: config.password
}
mongoose.connect(config.url, options);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({store: new RedisStore({
  client: client,
  host:'127.0.0.1',
  port:6379,
  prefix:'sess'
}), secret: 'SEKR37' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
