#Nodetron Server
Server dependency for [nodetron](https://github.com/bchu/nodetron). As with the rest of nodetron, this is still heavily in development.

###Install Instructions
Install Mongo and nodetron package:
* [Install Mongodb](http://docs.mongodb.org/manual/installation/). If you're on Mac, use homebrew.
* `npm install nodetron`

###Usage
Create a server:

    var Nodetron = require('nodetron').NodetronServer;
    var options = {port: 5000, debug: true};
    var server = new Nodetron(options);
Other options can be passed into the nodetron server:

**port:**  
  Set port for your server. Default is 80.

**debug:**  
  Will log extra socket connection information. Default is false.
  
**mongo:**  
  Sets which mongo db to connect to. Default is "mongodb://localhost/nodetron".
  
**userSchema:**  
  The database schema is created based on the metadata the app maker decides to use. Default is {use: false, path: null}. Change `use` to true and `path` to path of schema to use.
  
