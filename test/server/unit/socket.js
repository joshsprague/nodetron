describe("Sockets", function(){
  var socket,
  options = {"transports": ["websocket"], "force new connection": true};

  beforeEach(function(done){
    socket = io.connect("127.0.0.1:5000", options);
    done();
  });
  afterEach(function(done){
    socket.disconnect();
    done();
  });

  it("should get client list from server", function(done){
    socket.once("connect", function() {
      socket.once("users", function(data){
        expect(data).to.equal(JSON.stringify({"peerjs": {1: {token: 2, ip: "127.0.0.1"}}}));
        done();
      });

      socket.emit("login", {
        key: "peerjs",
        id: 1,
        token: 2,
        metadata: {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
      });
    });
  });

  it("should query the db correctly", function(done){
    socket.once("connect", function() {
      socket.once("query_response", function(data) {
        expect(data.users[0].firstName).to.equal("Foo");
        done();
      });

      socket.emit("login", {
        key: "peerjs",
        id: 1,
        token: 2,
        metadata: {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
      });
      socket.emit("query_for_user", {firstName:"foo"});
    });
  });
});
