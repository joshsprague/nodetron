//naive implementation of socket stub method.
var socketStub =  {};
socketStub.triggers = {};

socketStub.on =  function(trigger, callback){
  socketStub.triggers[trigger] = callback;
};

socketStub.emit = function(trigger,data){
  socketStub.triggers[trigger](data);
};

describe('registerWithServer', function(){
  it('should attached a socket and peer to the nodetron object', function(){
    nodetron.registerWithServer({host:'127.0.0.1'});
    expect(nodetron.socket).to.exist;
    expect(nodetron.self).to.exist;
  });

});

describe('findPeer', function(){
  it('should emit a valid query to the server', function(done){
    nodetron.registerWithServer({host:'127.0.0.1'});
    nodetron.socket.on('query_for_user', function(data){
      expect(data.queryId).to.exist;
      expect(data.queryParam).to.exist;
    });

    var cb = function(data){
      console.log('Callback executed with data:', data);
    };

    nodetron.findPeer({email:'foo'}, cb);
    done();
  });

  it('should fire the passed-in callback with the server\'s response data when ID\'s match', function(done){
    var queryId;
    var called = false;

    //swap out the websocket
    nodetron.socket = socketStub;

    nodetron.socket.on('query_for_user', function(data){
      console.log("Query for User Data is ", data);
      queryId = data.queryId;
    });

    var cb = function(){
      called = true;
    };

    nodetron.findPeer({email:'foo'}, cb);
    nodetron.socket.emit('query_response', {queryId:queryId,users:[]});
    expect(called).to.be.true;
    done();
  });
});
