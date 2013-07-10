describe('WorkerEvents', function() {

  var worker;
  beforeEach(function() {
    worker = new Worker('workerInternalEvents.js');
  });
  afterEach(function() {
    worker.terminate();
  });

  it('should handle a simple request for data', function(done) {
    worker.postMessageWithCallback('getUsers', function(users) {
      expect(users).to.be.an.intanceof(Array);
      done();
    });
  });

});

