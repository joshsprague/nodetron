var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  name: String,
  location: String,
  email: String
});

peerSchema.path("email").index({unique: true});

Peer = mongoose.model("Peer", peerSchema);
module.exports = Peer;