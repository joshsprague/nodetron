//params accepts title, version

var createDB = function(params) {
  var deferred = Q.defer();
  var dbRequest = indexedDB.open(params.title||'default', params.version||1);
  dbRequest.onerror = function(event) {
    console.log('dbRequest',event); //some sort of alert informing the user that they failed to grant permissions
    console.log('dbRequest',dbRequest.errorCode);
    deferred.reject(dbRequest.errorCode);
  };
  //upgrade is called before success
  dbRequest.onupgradeneeded = function(event) {
    var db = event.target.result;
    // Create an objectStore for this database
    console.log('dbRequest onupgradeneeded');
    var stores = params.stores;
    if (!stores) {
      return;
    }
    for (var i = 0; i < stores.length; i++) {
      var store = stores[i];
      db.createObjectStore(store.name, store.keys);
    }
  };
  dbRequest.onsuccess = function(event) {
    console.log('dbRequest onsuccess');
    db = dbRequest.result;
    deferred.resolve(db);
  };

  return deferred.promise;
};

