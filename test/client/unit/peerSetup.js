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
    nodetron.registerWithServer({host:'127.0.0.1'});
    nodetron.socket.on('query_for_user', function(data){
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
