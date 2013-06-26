//params accepts title, version

var createDB = function(params) {
  var deferred = Q.defer();
  var dbRequest = indexedDB.open(params.title||'default', params.version||1);
  dbRequest.onerror = function(event) {
    console.log(event); //some sort of alert informing the user that they failed to grant permissions
    console.log(dbRequest.errorCode);
    deferred.reject(dbRequest.errorCode);
  };
  //upgrade is called before success
  dbRequest.onupgradeneeded = function(event) {
    var db = event.target.result;
    // Create an objectStore for this database
    console.log('upgrade!');
    var users = db.createObjectStore("users", {keyPath: 'uuid'});
  };
  dbRequest.onsuccess = function(event) {
    console.log('got db');
    db = dbRequest.result;
    deferred.resolve(db);
  };

  return deferred.promise;
};

