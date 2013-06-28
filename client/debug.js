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
indexedDB.deleteDatabase('nodetron');