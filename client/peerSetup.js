window.nodetron = window.nodetron || {};
//Accepts a peer.js options, user metadata.  Returns a socket and peerjs connection
nodetron.registerWithServer = function(options){
  options = options || {};

  var cfg = {};
  cfg.host = options.host || '127.0.0.1'; //development:'127.0.0.1', production:bsalazar91-server.jit.su //localhost doesn't work
  cfg.port = options.port || '5000'; //development: 5000, production:80
  cfg.config =  options.config || {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
  cfg.debug = options.debug || true; //enable debugging by default
  cfg.key = options.key || 'peerjs'; //lwjd5qra8257b9'; // their default key.   'wb0m4xiao2sm7vi' is Jake's Key
  cfg.metadata = options.metadata || {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"};
  cfg.id = localStorage.getItem('_nodetron_uuid'); //uuid from web worker

  var socket = nodetron.socket = io.connect(cfg.host+':'+cfg.port);
  socket.on('users', function (data) {
    if(cfg.debug){console.log(data);}
    socket.emit('acknowledge', {received: true, metadata:cfg.meta});
  });

  //Connection handler
  var handleConn = function(conn){
    conn.on('data', function(data){
      if(cfg.debug){console.log('Got DataChannel data:', data);}
    });

    conn.on('error', function(err){
      if(cfg.debug){console.log('Got DataChannel data:', err);}
    });
  };

  //Setup the new peer object
  var peer = new Peer(cfg.id, {host: cfg.HOST, port: cfg.PORT}, socket);

  peer.on('error', function(err){
    if(cfg.debug){console.log('Got an error:', err);}
  });

  peer.on('close', function(err){
    if(cfg.debug){console.log('Connection closed', err);}
  });

  peer.on('open', function(id){
    if(cfg.debug){console.log('Connection Opened, User ID is', id);}
  });

  //Listen for incoming connections (direct from the sample)
  peer.on('connection', handleConn);

  return {peer: peer, socket: socket};
};

// creates a new connection and returns it
nodetron.initiatePeerConnection = function(peerJSCon, peerID){
  var conn = peerJSCon.connect(peerID,{'metadata':options});
  conn.on('open', function() {
    conn.send('Hello world!');
    console.log("Connection Opened");
  });
  conn.on('error', function(err){
    console.log('Got DataChannel error:', err);
  });
  conn.on('close', function(data){
    console.log('Connection Closed', data);
  });
  return conn;
};

nodetron.findPeer = function(socketCon, queryParam, callback){
  console.log(queryParam);
  var queryID = Math.random(); //TODO - upgrade this to a proper uuid function like uuid.v4();
  nodetron.activeQueries =  nodetron.activeQueries || {};
  nodetron.activeQueries[queryID] = callback;

  socketCon.emit('query_for_user', {queryID:queryID,queryParam:queryParam});

  var dispatchResponse = function(queryResponse){
    if(nodetron.activeQueries[queryResponse.queryID]){
      console.log("firing callback");
      nodetron.activeQueries[queryResponse.queryID](queryResponse.userID); //fire the callback
      delete nodetron.activeQueries[queryID]; //remove it from the events hash
    }
  };

  socketCon.on('query_response', dispatchResponse);
};