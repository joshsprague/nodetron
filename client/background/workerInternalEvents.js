//can't use this or window, must use self

//tuples are boolean function and callback pairs
//the first item in the tuple can also be a non-function primitive, in which case it is used for direct msg comparison
self.eventQueue = [];
self.checkEvents = function(msg) {
  var queue = this.eventQueue;
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var check = tuple[0];
    var instruction;
    if (typeof check !== 'function') {
      instruction = (check === msg);
    }
    //truthy -> match, but continue checking other events
    //falsy -> no match
    instruction = check(msg);
    if (instruction) {
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
  postMessage('WorkerInternalEvents Error!');
  postMessage(JSON.stringify(event));
});