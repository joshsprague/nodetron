describe("Sockets", function(){
  var socket, socket2,
  options = {"transports": ["websocket"], "force new connection": true};

  beforeEach(function(done){
    socket = io.connect("127.0.0.1:5000", options);
    socket.emit("login", {
      key: "default",
      id: 1,
      token: 2,
      metadata: {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
    });
    done();
  });
  afterEach(function(done){
    socket.disconnect();
    Peer = mongoose.model("Peer");
    Peer.remove({}, function(err){if(err) console.log(err);});
    done();
  });

  it("should get client list from server after login", function(done){
    socket.once("users", function(data){
      expect(data).to.equal(JSON.stringify({"default": {1: {token: 2, ip: "127.0.0.1"}}}));
      done();
    });
  });

  it("should get client list as other peers login", function(done) {
    socket.once("connect", function() {
      socket2 = io.connect("127.0.0.1:5000", options);
      socket2.once("connect", function() {
        socket2.once("users", function(data) {
          expect(data).to.equal(JSON.stringify({"default": {1: {token: 2, ip: "127.0.0.1"}, 3: {token: 4, ip: "127.0.0.1"}}}));
          socket2.disconnect();
          done();
        });

        socket2.emit("login", {
          key:"default",
          id: 3,
          token: 4,
          metadata: {firstName: "Bar", lastName: "Foo", email: "boo.far@gmail.com", city: "San Francisco", state: "CA", country: "USA"}
        });
      });
    });
  });

  it("should send query for peer correctly", function(done){
    socket.once("query_response", function(data) {
      expect(data.users.length).to.equal(1);
      done();
    });
    socket.emit("query_for_user", {queryId:123, queryParam: {firstName:"Foo"}});
  });
});
