//initialization
nodetron.init({
  dbTitle: 'nodetron',
  dbVersion: 1,
  serverUrl: 'http://localhost:5000'
});


//direct acces to worker
nodetron.worker;

//direct access to socket
nodetron.socket;

//A query - returns an array of objects.
nodetron.findResource({

});

//Peer-to-peer communication
nodetron.queryPeerResource({

});

nodetron.sendPeerMessage({

});