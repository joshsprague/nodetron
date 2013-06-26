//tuples are boolean function and callback pairs
this.eventQueue = [];
this.checkEvents = function(msg) {
  var queue = this.eventQueue;
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    if (tuple[0](msg)) {
      tuple[1](msg);
    }
  }
};
//accepts two function, check and callback.
//check return true and false. If true, callback is called on message data
this.addMessageEvent = function(check,callback) {
  eventQueue.push([check,callback]);
};

this.addEventListener('message', function(event) {
  var data = event.data;
  console.log(data);

  this.checkEvents(data);
});
this.addEventListener('error', function(event) {
  postMessage('Error!');
  postMessage(JSON.stringify(event));
});

