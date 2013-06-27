Worker.prototype.addMessageEvent = function(_id,cb) {
  if (typeof this.eventQueue === 'undefined') {
    this.eventQueue = {};
    this.addEventListener('message', function(event) {
      var data = event.data;
      console.log('Message to main!');
      console.log(event);
      console.log(data);
      this.checkEvents(data);
    });
  }
  var queue = this.eventQueue;
  if (typeof queue[_id] === 'undefined') {
    queue[_id] = [];
    // eventBuckets++;
  }
  if (typeof cb === 'function') {
    queue[_id].push(cb);
  }
};

Worker.prototype.checkEvents = function(msg) {
  if (!msg.origin) {
    return;
  }
  var bucket = this.eventQueue[msg.origin];
  if (bucket) {
    for (var i = 0; i < bucket.length; i++) {
      bucket[i](msg.data);
    }
    delete this.eventQueue[msg.origin];
  }
};

//cb can be a function, or 'false' for promise (to be implemented)
Worker.prototype.postMessageWithCallback = function(msg,cb) {
  // if (typeof this.eventBuckets === 'undefined') {
  //   this.eventBuckets = 0;
  // }
  var _id = msg;
  if (typeof msg !== 'string') {
    _id = JSON.stringify(msg);
  }
  // var _id = this.eventBuckets;
  // this.eventBuckets++;
  // var data = {
  //   _id:_id,
  //   msg:msg
  // };
  this.addMessageEvent(_id,cb);
  this.postMessage(msg);
};