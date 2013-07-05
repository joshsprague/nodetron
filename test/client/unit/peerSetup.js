describe('registerWithServer', function(){
  it('should return a socket and peer', function(){
    var connection = nodetron.registerWithServer();
    expect(connection.socket).to.exist;
    expect(connection.peer).to.exist;
  });

});


describe('findPeer', function(){
  it('should emit a valid query to the server', function(done){
    var connection = nodetron.registerWithServer();
    connection.socket.on('query_for_user', function(data){
      expect(data.queryId).to.exist;
      expect(data.queryParam).to.exist;
    });
    var cb = function(data){
      console.log('Callback executed with data:', data);
    };
    nodetron.findPeer(connection.socket,{email:'foo'}, cb);
    done();
  });
});
