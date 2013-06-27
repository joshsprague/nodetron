var PeerServer = require("./server.js").PeerServer;
var port = process.env.PORT || 5000;
var server = new PeerServer({port: port, debug: true});
console.log('Running on port: ',port);
