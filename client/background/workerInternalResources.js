var allow = {
  get:{
    users:true
  },
  post:{
  },
  put:{
  },
  delete:{
  }
};
var deny = {
  get:{
  },
  post:{
  },
  put:{
  },
  delete:{
  }
};

//if resource is undefined, all resources under that method will be toggled
var setAllow = function(method,resource) {
  if (!allow[method]) {
    return postError('setAllow', 'Method does not exist!');
  }
  allow[method][resource] = true;
};
var setDeny = function(method,resource) {
  if (!deny[method]) {
    return postError('setDeny', 'Method does not exist!');
  }
  deny[method][resource] = true;
};

var router = function(msg) {
  var method = msg.method;
  var resource = msg.resource; //model, type, resource
  var command = msg.commmand;
  if (command === 'setDeny') {
    return setDeny(method,resource);
  }
  if (command === 'setAllow') {
    return setAllow(method,resource);
  }
  if (!method || !resource) {
    return false;
  }
  // if (deny[method] && deny[method][resource]) {
  //   return false;
  // }
  // if (allow[method] && allow[method][resource]) {
  //   return true;
  // }
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