//stub
var noop = function(){};
nodetron.discoverResource=noop;
nodetron.requestPeerResource=noop;
nodetron.sendPeerMessage=noop;

//initialization
nodetron.init({
  dbTitle: 'nodetron',
  dbVersion: 1,
  serverUrl: 'http://localhost:5000'
});


//direct access to worker
nodetron.worker;

//direct access to socket
nodetron.socket;

//A query - returns an array of objects.
nodetron.discoverResource({

});

//Peer-to-peer communication
nodetron.requestPeerResource({

});

nodetron.sendPeerMessage({

});