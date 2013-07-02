var router = function(msg) {
  // var method = msg.method;
  var resource = msg.resource; //model, type, resource
  if (!resource) {
    return false;
  }
  return true;
};

addMessageEvent(function(msg) {
  return router(msg);
}, function(msg) {
  var items = [];
  db.transaction(msg.resource).objectStore(msg.resource).openCursor()
  .onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      items.push(cursor.value);
      cursor.continue();
    }
    else {
      msg = {
        request:msg,
        data:items
      };
      postMessage(msg);
    }
  };
});