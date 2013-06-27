//can't use this or window, must use self

//tuples are boolean function and callback pairs
self.eventQueue = [];
self.checkEvents = function(msg) {
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
self.addMessageEvent = function(check,callback) {
  eventQueue.push([check,callback]);
};

self.addEventListener('message', function(event) {
  var data = event.data;
  console.log(data);
  self.checkEvents(data);
});
self.addEventListener('error', function(event) {
  postMessage('Error!');
  postMessage(JSON.stringify(event));
});

