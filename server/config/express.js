var express = require('express'),
  stylus = require('stylus'),
  path = require('path');

module.exports = function(app) {
  // configure - all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('superSecretJarOfLearning'));
  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware(__dirname + '/../public'));
  app.use(express.static(path.join(__dirname, '../public')));

  // Setup development environment
  if (app.get('env') === 'development') {
    app.use(express.errorHandler());
  }
  else if (app.get('env') === 'production') {
  }
};