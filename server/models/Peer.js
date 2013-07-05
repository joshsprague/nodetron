var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  email: String
});

peerSchema.path("email").index({unique: true});

module.exports = peerSchema;
