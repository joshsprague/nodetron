module.exports = function(app) {
  // Setup mongo connection and mongoose schemas
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost/opened';

  // Connect to the database
  mongoose.connect(dbURI, function (err, res) {
    if (err) {
      console.log('ERROR connecting to: ' + dbURI + '. ' + err);
    } else {
      console.log('Succeeded connected to: ' + dbURI);
    }
  });
};
