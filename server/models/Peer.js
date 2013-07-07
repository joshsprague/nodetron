var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  clientID: String
});

peerSchema.path("clientID").index({unique: true});

module.exports = peerSchema;
