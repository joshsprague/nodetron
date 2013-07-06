(function(nodetron) {

  // creates a new connection and returns it
  //query:optional
  nodetron.initPeerConnection = function(peerID, query){
    console.log('initPeerConnection: ',options);
    var conn = nodetron.peer.connect(peerID,{'metadata':query});
    conn.eventBucket = 0;
    conn.idQueue = {};
    conn.requestQueue = {
      get:[],
      post:[],
      put:[],
      delete:[]
    };
    initConnEvents(conn);
    return conn;
  };

  var initConnEvents = function(conn) {
    conn.on('open', function() {
      conn.send('Acknowledge');
      console.log("Connection Opened");
    });

    //handles eventing
    conn.on('data', function(data) {

      //handle responses to requests.
      var callback = data._id && conn.idQueue[data._id];
      if (callback) {
        callback(data.data);
        conn.idQueue[data._id] = null;
      }

      //handle requests
      else {
        var events = conn.requestQueue[data.method]
        if (events) {
          var req = data;
          var resp = new Response(req,conn);
          for (var i = 0; i < events.length; i++) {
            if (events[i](req,resp)) {
              break;
            }
          }
        }
      }
    });
    conn.on('error', function(err){
      console.log('Got DataChannel error:', err);
    });
    conn.on('close', function(data){
      console.log('Connection Closed', data);
    });
  };


  //default method is get
  //conn accepts a peerid or dataconnection.
  nodetron.requestPeerResource = function(conn,query,callback) {
    if (typeof query.resource === 'undefined') {
      throw new Error('No resource requested');
    }
    query.method = query.method || 'get';
    var data = {_id:conn.eventBucket, query:query};
    if (!(conn instanceof DataConnection)) {
      conn = nodetron.initPeerConnection(conn, {metadata:data});
    }
    else {
      conn.send(data);
    }
    conn.idQueue[_id] = callback;
    conn.eventBucket++;
  };

  //func will be passed two args, req, and resp.
  //resp.accept() and resp.deny() are two functions that can be called
  nodetron.registerForPeerRequests = function(method,func) {
    var bucket = requestQueue[method];
    if (!bucket) {
      throw new Error('No such resource method.');
    }
    requestQueue[method].push(func);
  };

  var Response = function(req, conn) {
    this.connection = conn; //DataConnection
    this._id = req._id;
  };
  Response.prototype.send = function(response,data) {
    var obj = {
      _id:this._id,
      data:{
        response:response,
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