##peerSetup.js Interface Reference

###Methods for setting up a simple nodetron connection

####Step 1: Register your client with the server via:

     nodetron.registerWithServer(options)

'options' is a hash that contains the following.   Use it to configure connection options and communicate information about your client

    {
      host: <localhost>
      port: '80'
      config: {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
      key: <peerjs>
      id: //a uuid, if you want to override the default
      metadata : {firstname: "John" lastname: "Doe"}
    }

after establishing the session, registerWithServer responds with

    {
      peer: //the peerjs connection object
      socket: //the socket used for querying the server
    }

thus giving you direct access to the peer.js object and socket.io connection with the server

####Step 2: Initiate a connection with a remote peer via:

just pass in a peer's id and an active peer.js connection from nodetron

     nodetron.initiatePeerConnection(peer, peerID);

####Step 3: Find and connect to more users:
Give nodetron a socket connection to the server and some query parameters and the results into a callback of your choosing.

     nodetron.findPeer(socket, query_parameters, callback);

Query parameters can be anything the application developer chooses.  just specify one or more {key:value} pairs and an array of matching users (if any) will be passed to the callback;
