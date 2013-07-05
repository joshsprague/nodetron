describe("Mongo", function() {
  var socket,
  Peer = mongoose.model("Peer");
  options = {"transports": ["websocket"], "force new connection": true};

  beforeEach(function(done){
    socket = io.connect("127.0.0.1:5000", options);
    done();
  });
  afterEach(function(done){
    socket.disconnect();
    done();
  });

  it("should insert metadata into database and insert clientID", function(done){
    socket.once("connect", function() {
      socket.emit("login", {
        key: "peerjs",
        id: 1,
        token: 2,
        metadata: {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
      });
      Peer.find({}, function(err, data) {
        if(err) console.log(err);
        console.log(data[0]);
        expect(data.length).to.equal(1);
      });
      done();
    });
  });
});
