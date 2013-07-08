var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  clientId: String,
  email: String
});

peerSchema.path("clientId").index({unique: true});

module.exports = peerSchema;
