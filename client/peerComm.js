// request listeners
var requestQueue = {
    get:[],
    post:[],
    put:[],
    delete:[]
  };

// response listeners (listeners added to this object after a request has been sent)
var responseQueue = {};

// peerjs doesn't conform to its api: metadata isn't actually passed in to the callback
// metadata is actually on the connection object
// https://github.com/peers/peerjs/blob/master/docs/api.md#event-connection

// Set up an eventing system over a peer connection to handle requests/responses with callbacks.
// conn: DataConnection
// ignoreMetadata: boolean flag that causes connection metadata to be ignored
// rather than interpreted as a request
var eventifyConnection = function(conn, ignoreMetadata) {
  //handle already-established connections (e.g. responses)
  connectionHandler(conn);

  // handle requests (new connections):
  // self-initiated connections are passed back to the peer.on('connection') callback,
  if (!ignoreMetadata) {
    var data = conn.metadata;
    data && requestHandler(data,conn);
  }
};
// Handler for connection events. Handles 'data', 'open', and 'error' events.
// conn: DataConnection
var connectionHandler = function(conn){
  conn.on('open', function() {
    console.log("Connection Opened");
  });

  conn.on('data', function(data){
    if(nodetron.debug){console.log('Got DataChannel data:', data);}
    //handle responses to requests.
    var id = data._id;
    if (responseQueue[id]) {
      responseQueue[id](data.body);
      responseQueue[id] = null;
    }
    //handle other requests
    else {
      requestHandler(data,conn);
    }
  });
  conn.on('error', function(err){
    if(nodetron.debug){console.log('Got DataChannel data:', err);}
  });
};

// Handler for incoming requests. Requests checked against requestQueue.
// data: request object of format: {_id:<uuid>, query:
//                        {method, resource, data, identity}}
// conn: DataConnectioon
var requestHandler = function(data,conn) {
  console.log(data);
  var query = data.query;
  var events = requestQueue[query.method];
  if (events) {
    //resp will store data._id
    var resp = new Response(data,conn);
    for (var i = 0; i < events.length; i++) {
      //hide data._id from the user
      if (events[i](query,resp)) {
        break;
      }
    }
  }
};

/**
 * Start a WebRTC connection with a peer.
 * @public
 * @param  {string} peerId Unique peer id.
 * @param  {Object} metadata Metadata to send when requesting a connection.
 * @return {DataConnection}
 */
nodetron.startPeerConnection = function(peerId, metadata){
  var conn = nodetron.self.connect(peerId,{'metadata':metadata});
  eventifyConnection(conn, true);
  return conn;
};

/**
 * Send a resource request to another peer and register a callback on the response.
 * @param  {Peer, string, DataConnection} target Peer object, peer uuid,
 *                                               or raw DataConnection
 * @param  {Object}   query Request query object.
 * @param  {Function} callback Callback on response that received the response
 *                             object
 * @return {DataConnection} Connection to target.
 */
nodetron.requestPeerResource = function(target,query,callback) {
  if (typeof query.resource === 'undefined') {
    throw new Error('No resource requested');
  }
  //default method is 'get'
  query.method = query.method || 'get';
  var eventId = nodetron.uuid.v4();
  var metadata = {_id:eventId, query:query};

  if (typeof target === 'object') {
    target = nodetron.startPeerConnection(target.clientId, metadata);
  }
  else if (typeof target === 'string') {
    target = nodetron.startPeerConnection(target, metadata);
  }
  else {
    target.send(metadata);
  }
  //target is now a DataConnection instance
  responseQueue[eventId] = callback;
  return target;
};

/**
 * Response object
 * @constructor
 * @param  {Object} req  Request object
 * @param  {DataConnection} conn
 * @class Response object that wraps the DataConnection and exposes functions
 *        for sending data
 */
var Response = function(req, conn) {
  this.connection = conn; //DataConnection
  this._id = req._id;
};
//send a response with a message and data.
Response.prototype.send = function(msg,data) {
  var obj = {
    _id:this._id,
    body:{
      msg:msg,
      data:data
    }
  };
  this.connection.send(obj);
};
//send a response with the 'accept' message
Response.prototype.accept = function(data) {
  this.send('accept',data);
};
//send a response with the 'deny' message
Response.prototype.deny = function(data) {
  this.send('deny',data);
};

var listening = false;
/**
 * Register for peer requests.
 * @param  {string} method [description]
 * @param  {Function} handler Handler that is passed the request and a Response
 */
nodetron.registerForPeerRequests = function(method,handler) {
  if (typeof nodetron.self === 'undefined') {
    throw new Error('Cannot listen for requests. Peer has not been initialized.');
  }
  // only executed once:
  if (!listening) {
    nodetron.self.on('connection', eventifyConnection);
    listening = true;
  }

  var bucket = requestQueue[method];
  if (!bucket) {
    throw new Error('No such request method.');
  }
  requestQueue[method].push(handler);
};
