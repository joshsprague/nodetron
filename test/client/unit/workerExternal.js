describe('WebWorker', function() {

  var worker;
  beforeEach(function() {
    worker = new Worker('worker.js');
  });
  afterEach(function() {
    worker.terminate();
  });

  it('should initialize a worker with uuid and registration', function(done) {
    var msg = {
      init:true,
      uuid:uuid,
      registered:registered,
      dbTitle:'testDev',
      dbVersion:1
    };
    worker.postMessage(JSON.stringify(msg));
    expect(worker.postMessage).to.exist;

  });

});

