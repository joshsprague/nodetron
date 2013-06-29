var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  city: String,
  state: String,
  country: String
});

peerSchema.path("email").index({unique: true});

Peer = mongoose.model("Peer", peerSchema);
module.exports = Peer;
