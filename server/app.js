var express = require('express');
var http = require('http');

var app = express();

// Apply configuration
require('./config/db')(app);
require('./config/express')(app);
require('./config/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
