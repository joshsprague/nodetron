window.nodetron = window.nodetron || {};

nodetron.setup = function(options, success) {
  //can be undefined or truthy
  if (options.autologin !== false) {
    var id = localStorage.getItem('_nodetron_uuid');
    var metadata = localStorage.getItem('_nodetron_user_metadata');
    metadata = metadata && JSON.parse(metadata);
    if (id && metadata) {
      nodetron.registerWithServer(_.extend({
        id:id,
        metadata:metadata,
      }, options));
      success(metadata);
    }
  }
};

var registered = false;
//Accepts a peer.js options, user metadata.  Returns a socket and peerjs connection'
nodetron.registerWithServer = function(options){
  if (typeof options === 'undefined' || typeof options.host === 'undefined') {
    throw new Error('Host not specified!');
  }
  if (registered) {
    return;
  }

  options.port = options.port || 80; //development: 5000, production:80
  options.config =  options.config || {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
  options.debug = nodetron.debug = options.debug || false;
  options.key = options.key || 'default'; //lwjd5qra8257b9';  'wb0m4xiao2sm7vi' is Jake's Key
  options.metadata = options.metadata || JSON.parse(localStorage.getItem('_nodetron_user_metadata'));
  localStorage.setItem('_nodetron_user_metadata',JSON.stringify(options.metadata));
  options.id = options.id || localStorage.getItem('_nodetron_uuid'); //uuid from web worker
  options.token = uuid.v4(); //random token to auth this connection/session

  var socket = nodetron.socket = io.connect(options.host+':'+options.port);
  socket.emit('login', {
    key:options.key,
    id:options.id,
    token:options.token,
    metadata:options.metadata
  });

  socket.on('users', function (data) {
    if(options.debug){console.log(data);}
    socket.emit('acknowledge', {received: true});
  });
  if (options.debug) {
    socket.on('message', function(data){
      console.log('Nodetron: ',data);
    });
  }

  //Setup the new peer object
  var peer = nodetron.self = new Peer(options.id, {host: options.host, port: options.port}, socket);

  peer.on('error', function(err){
    if(options.debug){console.log('Got an error:', err);}
  });

  peer.on('close', function(err){
    if(options.debug){console.log('Connection closed', err);}
  });

  peer.on('open', function(id){
    if(options.debug){console.log('Connection Opened, User ID is', id);}
  });
  registered = true;
};

nodetron.findPeer = function(socketCon, queryParam, callback){
  var queryId = window.uuid.v4();

  nodetron.activeQueries =  nodetron.activeQueries || {};
  nodetron.activeQueries[queryId] = callback;

  console.log("Querying server for: ", queryParam);
  nodetron.socket.emit('query_for_user', {queryId:queryId,queryParam:queryParam});

  var dispatchResponse = function(queryResponse){
    console.log("Received queryResponse from Server");
    if(nodetron.activeQueries[queryResponse.queryId]){
      console.log("firing callback");
      nodetron.activeQueries[queryResponse.queryId](queryResponse.users);
      delete nodetron.activeQueries[queryId];
    }
    else {
      throw new Error("Bad Query Response from server", queryResponse);
    }
  };

  nodetron.socket.on('query_response', dispatchResponse);
};
