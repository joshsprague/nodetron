var PeerServer = require("nodetron").PeerServer;
var options = {
  port: 5000,
  debug: true, //Enable server logs
  mongo: "mongodb://localhost/nodetron"
};
var server = new PeerServer(options);
console.log('Running on port: ', options.port);
