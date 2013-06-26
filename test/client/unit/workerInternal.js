describe('WebWorker', function() {
  // var script;
  var worker;
  beforeEach(function() {
    // var replace = window.postMessage;
    // var importScripts = function(url) {
    //   console.log('import');
    //   return url;
    // };
    // var postMessage = function(msg) {
    //   console.log('WebWorker: ', msg);
    //   return replace.apply(this,arguments);
    // };
    // script = $.getScript("http://localhost:9876/base/client/worker.js");
    worker = new Worker('worker.js');
    var msg = {
      init:true,
      uuid:uuid,
      registered:registered,
      dbTitle:'nodetron',
      dbVersion:1
    };
    worker.postMessage(JSON.stringify(msg));
  });
  afterEach(function() {
    worker.terminate();
  });

  it('should have called createDb', function(done) {
    expect(db).to.exist;
    done();
  });

});

