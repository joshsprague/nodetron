describe('registerWithServer', function(){
  it('should attached a socket and peer to the nodetron object', function(){
    var connection = nodetron.registerWithServer();
    expect(nodetron.socket).to.exist;
    expect(nodetron.peer).to.exist;
  });

});


describe('findPeer', function(){
  it('should emit a valid query to the server', function(done){
    nodetron.registerWithServer();
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
});
