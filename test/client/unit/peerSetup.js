describe('registerWithServer', function(){

  it('should return a socket and peer', function(){
    var connection = nodetron.registerWithServer();
    expect(connection.socket).to.exist;
    expect(connection.peer).to.exist;
  });

});
