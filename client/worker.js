//handle requests from the main loop
this.addEventListener('message', function(e) {
  this.postMessage(e.data);

}, false);

//this.close terminates the worker