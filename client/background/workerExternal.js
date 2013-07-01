(function(nodetron) {
  nodetron.worker = new Worker('background/workerInternal.js');

  var uuid = localStorage.getItem('_nodetron_uuid') || uuid.v4();
  localStorage.setItem('_nodetron_uuid', uuid);
  var registered = localStorage.getItem('_nodetron_registered') || false;
  localStorage.setItem('_nodetron_registered',registered);

  // Normally workers pass objects by copy, not reference.
  // worker can be passed other types like File, Blob, ArrayBuffer/
  nodetron.init = function(params) {
    var msg = {
      init:true,
      uuid:uuid,
      registered:registered,
      dbTitle:params.dbTitle,
      dbVersion:params.dbVersion,
      serverUrl:params.serverUrl
    };
    nodetron.worker.postMessage(msg);
    nodetron.worker.addEventListener('message', function(event) {
      console.log('Message to main!');
      console.log(event);
    });
  };

  //to pass objects by reference, do worker.postMessage(data, <array of ArrayBuffers>);
  //https://zapier.com/engineering/intro-to-web-workers/
})(this.nodetron || (this.nodetron = {}));