##Nodetron API Reference

A comprehensive reference to Nodetron APIs.  This document is divided into three sections: __Section 1__ is an overview of this library. __Section 2__ covers interactions between the client and the server.  __Section 3__ covers clients communicating directly with each other over WebRTC.

###SECTION 1: Overview

The philosophy behind Nodetron can be summed as:

1. Clients store all of their own data.
2. Clients publish make certain pieces of data public available so that other clients can discover them. This data can be stored by other clients and central servers.
3. Clients discover other clients by querying a local cache, other clients, or a central server.
    * the current implementation only allows for querying a central server.
4. Clients access another client's non-public data by directly sending requests to that other client, with associated metadata.
5. Clients handle those requests and determine their response.Clients are responsible for authentication of requests.

###SECTION 2: Server-client communication:

####First, register your client with the server via:

     nodetron.registerWithServer(options)

'options' has the following properties. Default values are filled in:

    {
      host: //no default,
      port: 80,
      debug: false,
      config: {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
    }

* __host__: server URL
    * `host` cannot be `localhost`. You can use `127.0.0.1` instead.
* __debug__: enables verbose logging.
* __config__: configure STUN and TURN servers. Generally you should not need to use this option.

After calling `nodetron.registerWithServer`, you can access the underlying socket.io connection through `nodetron.socket`.

####Next, login with a user:

    nodetron.login(options)

`options` has the following properties, with default values filled in:

    {
      userData: //example: {name: "John" gender: "male"},
      key: 'default',
      id: //automatically generated
      newId: false
    }

* __userData__: an object of arbitrary key-value pairs. Other clients can discover this client by querying against this data.
* __key__: a string that can be used to segment users. Only users with the same key can contact each other. Generally you should not need to use this option
* __id__: a unique id for this user. Unless an id is explicitly specified, Nodetron will reuse the current id if the user is already logged in, and otherwise a unique id is automatically generated. Generally you should not need to specify this option.
* __newId__: a boolean flag indicating whether to create a new id. Setting to `true` causes Nodetron to assign the user a new id.

You should also use this function to update user data on the server (e.g. you want to change the user name from "John" to "Sarah").

####Next, find and connect to more users!
Give Nodetron some query parameters (based on the arbitrary userData each client publishes).

     nodetron.findPeer(query, callback);

Query parameters can be anything the application developer chooses.  just specify one or more {key:value} pairs and an array of matching `Peer` objects (if any) will be passed to the callback;

###SECTION 3: Inter-client communication:

#####Requesting resources from other clients

Once the application has discovered peers that satisfy your query, request resources from other peers with:

    nodetron.requestPeerResource(<target>,{
      method:<method>, //default: 'get'
      resource:<resource>,
      data:<object>,
      identity:<object>
    }, <callback>);

* __target__: the peer you are sending the request to. This can be a `Peer` object, a uuid that corresponds to another user, or a `DataConnection` object.
* __method__: accepts the following string: 'get', 'post', 'put', 'delete.' This indicates that this request is for accessing a resource, adding a resource, adding or updating a resource, or deleting a resource, respectively. This defaults to 'get.'
* __resource__: the name of the resource to be accessed.
* __data__: an arbitrary object to pass to the requestee. Generally this will be a query object or an object containing data to be sent.
* __identify__: an arbitrary object containing identifying data about the originator (including any auth tokens)
    * data-key query format (modeled after mongo): `{<key>:<selectors>}`
    if selector is not an object, then direct comparison
    if selector is an object, it will be a series of key-value pairs, where key = selector (i.e. `$gt`), value = comparison value
* __callback__ is a function that will be passed a response object:

Full response object format:

    response = {
      msg:
      data:
    }

* __msg__ contains an arbitrary response message.
    * we recommend using 'accept' and 'deny'.
* __data__ contains arbitrary data.
* Note: If you inspect the raw WebRTC connection, you will notice that Nodetron attaches some additional metadata that is abstracted away from you, the end-user.

### On the other side of the request-response cycle:
#### Listen for requests from other clients:

To register callback for peer requests, use:

    nodetron.registerForPeerRequests(method, requestHandler)

* __method__: the request method (i.e. `get`, `post`, `put`, or `delete`)
* __requestHandler__: a function that is passed two parameters, the request and response objects:

    requestHandler(request, response) {}

Since multiple request handlers can be registered on a method, the requestHandler should return `false` if you wish for the request to be passed to other request handlers, or `true` if the request does not need to be passed to other request handlers.

* __request__ has same format as the request object in requestPeerResource (method, resource, data, identity)
* __response__ is an object with two methods:
    * __send(message, data)__: takes two arguments: message and data. This method sends a response object to the originating peer (the requester), with the format {msg: message, data: data};
    * __accept(data)__: an alias for {msg: 'accept', data: data}
    * __deny(data)__: an alias for {msg: 'deny', data: data}
