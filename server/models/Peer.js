var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  clientId: String,
  email: String
});

peerSchema.path("clientID").index({unique: true});

module.exports = peerSchema;
