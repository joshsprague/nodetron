var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  // firstName: String,
  // lastName: String,
  // city: String,
  // state: String,
  // country: String,
  clientID: String,
  email: String
});

peerSchema.path("email").index({unique: true});

module.exports = peerSchema;
