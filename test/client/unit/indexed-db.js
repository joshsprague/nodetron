describe('WebWorker-IndexedDB', function() {

  var db;
  beforeEach(function() {
    db = createDB({
      title:'testDev',
      version:1
    });
  });

  it('should initialize a db', function(done) {
    db.finally(function() {
      var result = db.inspect().value;
      expect(result).to.exist;
      expect(result).to.have.property('createObjectStore');
      done();
    });
  });

});

