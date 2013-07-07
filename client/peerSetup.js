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

  var cfg = options;
  cfg.host = options.host; //development:'127.0.0.1', production:bsalazar91-server.jit.su //localhost doesn't work
  cfg.port = options.port || 80; //development: 5000, production:80
  cfg.config =  options.config || {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
  cfg.debug = options.debug || true; //enable debugging by default
  nodetron.debug = options.debug;
  cfg.key = options.key || 'default'; //lwjd5qra8257b9'; // their default key.   'wb0m4xiao2sm7vi' is Jake's Key
  cfg.metadata = options.metadata || JSON.parse(localStorage.getItem('_nodetron_user_metadata'));
  cfg.id = options.id || localStorage.getItem('_nodetron_uuid'); //uuid from web worker
  cfg.token = uuid.v4(); //random token to auth this connection/session

  localStorage.setItem('_nodetron_user_metadata',JSON.stringify(options.metadata));

  var socket = nodetron.socket = io.connect(cfg.host+':'+cfg.port);
  socket.emit('login', {
    key:cfg.key,
    id:cfg.id,
    token:cfg.token,
    metadata:cfg.metadata
  });

  socket.on('users', function (data) {
    if(cfg.debug){console.log(data);}
    console.log('acknowledge');
    socket.emit('acknowledge', {received: true});
  });
  if (cfg.debug) {
    socket.on('message', function(data){
      console.log('Nodetron: ',data);
    });
  }

  //Setup the new peer object
  var peer = nodetron.self = new Peer(cfg.id, {host: cfg.HOST, port: cfg.PORT}, socket);

  peer.on('error', function(err){
    if(cfg.debug){console.log('Got an error:', err);}
  });

  peer.on('close', function(err){
    if(cfg.debug){console.log('Connection closed', err);}
  });

  peer.on('open', function(id){
    if(cfg.debug){console.log('Connection Opened, User ID is', id);}
  });

  registered = true;
  return {peer: peer, socket: socket};
};

nodetron.findPeer = function(socketCon, queryParam, callback){
  var queryID = window.uuid.v4();
  nodetron.activeQueries =  nodetron.activeQueries || {};
  nodetron.activeQueries[queryID] = callback;

  console.log("Querying server for: ", queryParam);
  socketCon.emit('query_for_user', {queryID:queryID,queryParam:queryParam});

  var dispatchResponse = function(queryResponse){
    console.log("Received queryResponse from Server");
    if(nodetron.activeQueries[queryResponse.queryID]){
      console.log("firing callback");
      nodetron.activeQueries[queryResponse.queryID](queryResponse.users); //fire the callback
      delete nodetron.activeQueries[queryID]; //remove it from the events hash
    }
    else {
      throw new Error("Bad Query Response from server", queryResponse);
    }
  };

  socketCon.on('query_response', dispatchResponse);
};
