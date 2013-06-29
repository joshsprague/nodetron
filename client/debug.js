//DEBUG CODE:
window.getdata = function(string) {
  var db;
  var request = indexedDB.open("nodetron");
  request.onerror = function(event) {
    console.log('error');
    console.log(event);
  };
  request.onsuccess = function(event) {
    db = request.result;
    db.transaction("users").objectStore("users").get(string).onsuccess = function(event) {
      console.log(event.target.result.name);
    };
  };
};
// indexedDB.deleteDatabase('nodetron');
// indexedDB.open('nodetron').onsuccess = function(e) {e.target.result.deleteObjectStore('users');};
// worker.postMessageWithCallback({method:'get',resource:'users'},function(res){console.log(res)});

// indexedDB.open('nodetron').onsuccess = function(event){event.target.result.transaction(['users'],'readwrite').objectStore('users').put(JSON.parse('{"uuid":"aaa341f2-2fed-4999-b250-2e21b9c51f9c","token":"1krxjqnnvytu766r","ip":"127.0.0.1"}')).onsuccess = function(err){console.log(err)}};