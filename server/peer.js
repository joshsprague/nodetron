var Nodetron = require("./server.js").NodetronServer;
var options = {
  port: 5000,
  debug: true //Enable server logs
};
var server = new Nodetron(options);
console.log('Running on port: ', options.port);
