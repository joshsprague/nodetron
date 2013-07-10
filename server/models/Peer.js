var mongoose = require("mongoose");

var peerSchema = new mongoose.Schema({
  clientId: {
    type: String,
    index: {
      unique: true
    }
  }
});

module.exports = peerSchema;
