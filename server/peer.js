var PeerServer = require("./server").PeerServer;
var options = {
  port: 5000,
  debug: true, //Enable server logs
  mongo: "mongodb://localhost/nodetron" //mongo db to connect to
};
var server = new PeerServer(options);
console.log('Running on port: ', options.port);
