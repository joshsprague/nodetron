//params accepts title, version

var createDB = function(params) {
  var deferred = Q.defer();
  //open takes two params: title and version
  var dbRequest = indexedDB.open(params.title||'default', params.version||1);
  dbRequest.onerror = function(event) {
    //TODO: add some sort of alert informing the user that they failed to grant permissions
    console.log('dbRequest',event);
    console.log('dbRequest',dbRequest.errorCode);
    deferred.reject(dbRequest.errorCode);
  };
  //onupgradeneeded is called before onsuccess
  dbRequest.onupgradeneeded = function(event) {
    var db = event.target.result;
    // Create an object store (like a mongoDB collection) for this database
    console.log('dbRequest onupgradeneeded');
    var stores = params.stores;
    if (!stores) {
      return;
    }
    for (var i = 0; i < stores.length; i++) {
      var store = stores[i];
      //keyPath is analogous to an SQL primary key, must be unique and must be present in every object in the object store.
      console.log('onupgradeneeded store ',store);
      db.createObjectStore(store.name, {keyPath: store.keyPath});
    }
  };
  dbRequest.onsuccess = function(event) {
    console.log('dbRequest onsuccess');
    db = dbRequest.result;
    deferred.resolve(db);
  };

  return deferred.promise;
};

