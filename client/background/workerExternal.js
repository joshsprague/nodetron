nodetron.worker = new Worker('scripts/nodetron/background/workerInternal.js');

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
