(function(window) {
  var nodetron = window.nodetron || (window.nodetron = {});
  nodetron.worker = new Worker('scripts/nodetron/background/workerInternal.js');

  var localStor = window.localStorage;
  var uuid = nodetron.id = localStor.getItem('_nodetron_uuid') || window.uuid.v4();
  localStor.setItem('_nodetron_uuid', uuid);
  var registered = localStor.getItem('_nodetron_registered') || false;
  localStor.setItem('_nodetron_registered',registered);

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
})(this);