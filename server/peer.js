var PeerServer = require("./server.js").PeerServer;
var options = {
  port: process.env.PORT || 5000,
  debug: true, //Enable server logs
  mongo: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/test"
};
var server = new PeerServer(options);
console.log('Running on port: ', options.port);
