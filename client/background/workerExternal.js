var worker = new Worker('workerInternal.js');

// call worker with string - use string for compatibility.
// Can handle other types like File, Blob, ArrayBuffer, JSON, but compatibility is less
// Normally workers pass objects by copy, not reference.
var uuid = localStorage.getItem('_nodetron_uuid') || uuid.v4();
localStorage.setItem('_nodetron_uuid', uuid);
var registered = localStorage.getItem('_nodetron_registered') || false;
localStorage.setItem('_nodetron_registered',registered);

var msg = {
  init:true,
  uuid:uuid,
  registered:registered,
  dbTitle:'nodetron',
  dbVersion:1
};
worker.postMessage(msg);

//to pass objects by reference, do worker.postMessage(data, <array of ArrayBuffers>);
//https://zapier.com/engineering/intro-to-web-workers/