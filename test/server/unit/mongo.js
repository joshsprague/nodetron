var mongoose = require("mongoose");

describe("Mongo", function() {
  var socket, Peer,
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
    Peer.remove({}, function(err, data) {
      if(err) console.log(err);
    });
    done();
  });

  it("should insert metadata into database", function(done){
    socket.once("users", function(data){
      Peer = mongoose.model("Peer");
      Peer.find(function(err, data) {
        if(err) console.log(err);
        expect(data.length).to.equal(1);
        expect(data[0].firstName).to.equal("Foo");
      });
      done();
    });
  });

  it("should add clientId to db", function(done) {
    socket.once("users", function(data){
      Peer = mongoose.model("Peer");
      Peer.find(function(err, data) {
        if(err) console.log(err);
        expect(data[0].clientId).to.equal(1);
      });
      done();
    });
  });

  it("should query correct user", function(done) {
    socket.once("query_response", function(data) {
      expect(data.users[0].firstName).to.equal("Foo");
      done();
    });

    socket.emit("query_for_user", {queryId: 123, queryParam:{firstName: "Foo"}});
  });

  it("should update user metadata", function(done) {
    socket.once("query_response", function(data) {
      Peer = mongoose.model("Peer");
      Peer.find(function(err, data) {
        if(err) console.log(err);
        expect(data[0].lastName).to.equal("Far");
      });
      done();
    });

    socket.emit("update_metadata", {id: 1, metadata: {firstName: "Boo", lastName: "Far"}});
    socket.emit("query_for_user", {queryId: 123, queryParam: {firstName: "Boo"}});
  });
});
