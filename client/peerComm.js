(function(nodetron) {

  var requestQueue = {
      get:[],
      post:[],
      put:[],
      delete:[]
    };
  var responseQueue = {
  };
  //peerjs doesn't conform to its api: metadata isn't actually passed in to the callback
  //metadata is actually on the connection object
  //https://github.com/peers/peerjs/blob/master/docs/api.md#event-connection
  var eventifyConnection = function(conn, ignoreMetadata) {
    // conn.eventBucket = 0;
    // conn.idQueue = {};
    //handle already-established connections (e.g. responses)
    connectionHandler(conn);

    // handle requests (new connections):
    //ignore metadata is used such that you don't process your own metadata
    if (!ignoreMetadata) {
      var data = conn.metadata;
      data && requestHandler(data,conn);
    }
  };
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
      // var callback = data._id && conn.idQueue[data._id];
      // if (callback) {
      //   callback(data.data);
      //   conn.idQueue[data._id] = null;
      // }
      //handle other requests
      else {
        requestHandler(data,conn);
      }
    });
    conn.on('error', function(err){
      if(nodetron.debug){console.log('Got DataChannel data:', err);}
    });
  };
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

  nodetron.startPeerConnection = function(peerId, metadata){
    var conn = nodetron.self.connect(peerId,{'metadata':metadata});
    eventifyConnection(conn, true);
    return conn;
  };

  //default method is get
  //conn accepts a peerid, dataconnection, or peer object.
  nodetron.requestPeerResource = function(target,query,callback) {
    if (typeof query.resource === 'undefined') {
      throw new Error('No resource requested');
    }
    query.method = query.method || 'get';
    // var eventId = target.eventBucket;
    var eventId = window.uuid.v4();
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
    // target.idQueue[eventId] = callback;
    // target.eventBucket++;
  };

  //func will be passed two args, req, and resp.
  //resp.accept() and resp.deny() are two functions that can be called
  var listening = false;
  nodetron.registerForPeerRequests = function(method,func) {

    if (!listening) {
      nodetron.self.on('connection', eventifyConnection);
      listening = true;
    }

    var bucket = requestQueue[method];
    if (!bucket) {
      throw new Error('No such request method.');
    }
    requestQueue[method].push(func);
  };

  var Response = function(req, conn) {
    this.connection = conn; //DataConnection
    this._id = req._id;
  };
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
  Response.prototype.accept = function(data) {
    this.send('accept',data);
  };
  Response.prototype.deny = function(data) {
    this.send('deny',data);
  };

  /* access permissions:
  deny takes precedence over allow
  everything is by default denied, except for getting the list of users.
  this only applies to public info - publicAllow and publicDeny allow any outside party
  to get all elements of a resource from your database.
  to customize allow/deny, call registerForPeerRequests
  Note that the allow/deny lists take precedence over
  */
  var publicAllow = {
    get:{
      users:true
    },
    post:{
    },
    put:{
    },
    delete:{
    }
  };
  var publicDeny = {
    get:{
    },
    post:{
    },
    put:{
    },
    delete:{
    }
  };

  //if resource is undefined, all resources under that method will be toggled
  nodetron.publicAllow = function(method,resource) {
    if (!allow[method]) {
      console.error('nodetron.allow: ', 'No such resource method.');
      return;
    }
    allow[method][resource] = true;
  };
  nodetron.publicDeny = function(method,resource) {
    if (!deny[method]) {
      console.error('nodetron.allow: ', 'No such resource method.');
      return;
    }
    deny[method][resource] = true;
  };

})(this.nodetron || (this.nodetron = {}));