##NodeTron API Reference

A comprehensive reference to Nodetron APIs.  This document is divided into two sections:  __Section 1__ covers interactions between the client and the server.  __Section 2__ covers clients communicating directly with eachother over WebRTC.

###SECTION 1: Server-client communication:

#####Methods for setting up a simple nodetron connection

####First, register your client with the server via:

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

after establishing the session, registerWithServer will attach peer and socket connection objects to nodetron.peer and nodetron.socket respectively

####Next, initiate a connection with a remote peer.

just pass in a peer's id and nodetron will establish a connection

     nodetron.initiatePeerConnection(peerId);

####Finally, find and connect to more users!
Give nodetron some query parameters (based on the arbitrary metadata each client publishes)

     nodetron.findPeer(query_parameters, callback);

Query parameters can be anything the application developer chooses.  just specify one or more {key:value} pairs and an array of matching users (if any) will be passed to the callback;


###SECTION 2: Inter-client communication:

#####Request-response-access protocol for communicating between clients over WebRTC

Request for access to X:

    nodetron.requestPeerResource(<peer_id or data_connection>, {
      method:<method>,
      resource:<resource>,
      data:<object>,
      identity:<object>
    }, <callback>);

or:
`<nodetron_Peer>.requestPeerResource({<same_params_object>}, <callback>)`

* __method__: get, post, put, delete (get, add, update or add, delete)
* __resource__: name of resource (maps to db)
* __data__: if get, a query; if post, an object; if put, an object; if delete, a query.
* __identify__: object containing key-value pairs of data about the originator (including any auth tokens)
* data-key query format (modeled after mongo): `{<key>:<selectors>}`
    if selector is not an object, then direct comparison
    if selector is an object, it will be a series of key-value pairs, where key = selector (i.e. `$gt`), value = comparison value
* callback is passed the response:

Full request object format:

    {
      _id:<internal Nodetron id>
      query:{
        method:<method>,
        resource:<resource>,
        data:<object>,
        identity:<object>
      }
    }


Full response object format:

    response = {
      _id: <id for response so that requester can match up responses> (nodetron use only),
      data: {
        response: <'accept' or 'deny'>
        data: <data>
      }
    }

The response handler's data (i.e. `response.accept(data)`) will only be passed into the response.data field (the first `data` field). `_id` is for Nodetron's internal use only.

Response format (as appears to the response handler):

    //responseHandler is a function
    responseHandler({
      response:<string>,
      data:<data>
    })

* response: literal string: 'accept' or 'deny'
* data: if accept, the data requested; if deny, an error code

Register for requests:

`nodetron.registerForPeerRequests(method, resource, handler)`

method is the request method, resource is the resource the method acts upon.

handler takes a req and resp argument and calls accept or deny on the resp object.

`req` has same format as requestPeerResource (method, resource, data, identity)

`resp` has two methods:
* resp.accept(data)
* resp.deny(data)
