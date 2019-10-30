
module.exports = (app, server) => {
  
  var express = require('express');
  var createError = require('http-errors');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  
  var indexRouter = require('./routes/index');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Firebase App (the core Firebase SDK) is always required and
  // must be listed before other Firebase SDKs
  var firebase = require("firebase/app");
  
  // Add the Firebase products that you want to use
  require("firebase/auth");
  
  var firebaseConfig = require('./bin/firebaseconfig.js');
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  app.set('firebase', firebase);
  
  var io = require('socket.io').listen(server);
  app.set('io', io);
  
  require('./api/auth')(app);
  
  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};
