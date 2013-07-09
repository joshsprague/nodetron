var PeerServer = require("./server.js").PeerServer;
var options = {
  port: process.env.PORT || 5000,
  debug: true, //Enable server logs
  mongo: "mongodb://localhost/nodetron"
};
var server = new PeerServer(options);
console.log('Running on port: ', options.port);
