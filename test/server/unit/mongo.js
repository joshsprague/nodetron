var mongoose = require("mongoose");

describe("Mongo", function() {
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

  it("should insert metadata and clientID into database", function(done){
    socket.once("connect", function() {
      socket.once("users", function(data){
        Peer = mongoose.model("Peer");
        Peer.find(function(err, data) {
          if(err) console.log(err);
          expect(data.length).to.equal(1);
          expect(data[0].clientID).to.equal(1);
          expect(data[0].firstName).to.equal("Foo");
        });
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

  it("should update user information", function(done) {
    socket.once("connect", function() {
      socket.once("users", function(data){
        Peer = mongoose.model("Peer");
        Peer.find(function(err, data) {
          if(err) console.log(err);
          expect(data.length).to.equal(1);
          expect(data[0].firstName).to.equal("Boo");
        });
        done();
      });

      socket.emit("login", {
        key: "peerjs",
        id: 1,
        token: 2,
        metadata: {firstName:"Boo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
      });
    });
  });

  it("should update client metadata", function(done) {
    socket.once("connect", function() {
      socket.once("", function(data) {

      });

      socket.emit("login", {
        key: "peerjs",
        id: 1,
        token: 2,
        metadata: {firstName:"Foo", lastName:"bar", email:"foo.bar@gmail.com", city: "San Francisco", state: "CA",  country:"USA"}
      });

      socket.emit("update_metadata",{id: 1, metadata: {city: "Monrovia"}});
    });
  });
});
