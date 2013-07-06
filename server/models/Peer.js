var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  clientID: String,
  email: String
});

peerSchema.path("email").index({unique: true});

module.exports = peerSchema;
