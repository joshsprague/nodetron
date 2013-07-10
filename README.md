#Nodetron

**This project is under heavy development. Its API is subject to major, breaking changes.**

A peer-to-peer, rich-client web app library that uses HTML5 WebRTC and Web Workers to reduce reliance on central servers and enable greater decentralization by routing requests directly to peers.

####[Full API Documentation](https://github.com/bchu/nodetron/blob/master/docs/API.md/)
####[Notes on Different Approaches](https://github.com/bchu/nodetron/blob/master/docs/Approach.md/)
####[Future Roadmap](https://github.com/bchu/nodetron/blob/master/docs/Roadmap.md/)

<br>
####[Play with a demo app](http://demo.nodetron.com)
<br>

###Overview

Nodetron helps you easily create peer-to-peer applications that do more than just send chats or transfer files. Nodetron consists of a routing and discovery system with which developers can build rich client-side apps that control all user data locally. With Nodetron, all data validation and access permissions are delegated to and handled by the client. Developers are encouraged to then take advantage of IndexedDB, AppCache, and other HTML 5 APIs. In the future, Nodetron will feature tighter integration with those kinds of rich-client APIs.

In more detail:

1. Clients store all of their own data.
2. Clients make certain pieces of data public available so that other clients can discover them. This data can be stored by other clients and central servers.
3. Clients discover other clients by querying a local cache, other clients, or a central server.
  * the current implementation only allows for querying a central server. This will change in the future.
4. Clients access another client's non-public data by directly sending requests to that other client, with associated metadata.
5. Clients handle those requests and determine their response. Clients are responsible for authentication of requests. Nodetron will include authentication mechanisms in the future.

Technologies used: WebRTC, socket.io, MongoDB, node-restify.

### Getting Started

*Note: only recent versions of Chrome and Firefox are currently supported*

1. On the client side: Include the `nodetron.js` (or `nodetron.min.js`) scripts manually or use `bower install nodetron`.
2. On the server side: `npm install nodetron`.

### Development Instructions

* `npm install && bower install` in the project root.
* `git submodule init && git submodule update --remote`
  * `--remote` requires git version >=1.8
  * Since this project is under continuous development, you may need to re-run the above the commands after pulling the lastest upstream changes.
* To build the project (the client-side portion), run `grunt build`.
* To run the server, [install MongoDB](http://docs.mongodb.org/manual/installation/). If you're on a Mac, use homebrew!
* For debugging, install global dependencies: `npm -g install node-inspector`
* When working inside of the submodules of this project, make sure to checkout the correct branch.
  * For `demo`, checkout `internal`.
  * For `client/webrtc`, checkout `master`.
* If you intend to run the `demo` app, be sure to follow [the submodule README instructions](https://github.com/bchu/nodetron-standhub).

* `grunt all` to run the server and the `demo` client-side app, with livereload.
  * Append `:<number>` to specify how many demo client-side instances you want to run.
  * Append `:debug` to run node-inspector as well.
  * Ex: `grunt:4:debug` runs 4 demo client instances at ports 9000-9004 and runs node-inspector.
* `grunt client` to serve the demo client-side app, with livereload.
  * Append `:unit` to run unit tests.
* `grunt server` to run the server, with reloading.
  * Append `:unit` to run unit tests.
  * Append `:debug` to run node-inspector.
* `grunt e2e` to run client e2e tests on Chrome (not implemented yet).
* `grunt cross` to run client e2e tests on Firefox as well as Chrome (not implemented yet).

If you get a `Error: Cannot find module './build/Debug/DTraceProviderBindings'` error, remove `restify` from your local `node_modules` folder and re-run `npm install` in the project root.

More resources:

1. Workflow instructions at <https://github.com/bchu/nodetron/wiki/Workflow>

###Deployment Instructions (Nodejitsu)
1. Install the jitsu package using `npm install -g jitsu`
  * supply any necessary credentials.
2. Login using `jitsu login`
3. Deploy using `jitsu deploy`.
4. Current domain: http://bsalazar91-server.jit.su at port:80 and http://nodetron.jit.su at port:80.

**Browser Compatibility**

* Web Workers: IE10+
* IndexedDB: IE10+, should use moz/webkit prefixes, FF10+, CH23+, no Safari
  * WebSQL shim for Safari and mobile
* WebRTC: no IE, FF20+, CH26+, no Safari.

###Current Prototype Implementation

Clients send 'discovery queries' to a central server/database. The server responds with potential matches. Clients then contact the matches directly over a WebRTC connection that is brokered by the server. Clients then freely exchange information. Clients specify what information they make publicly available for discovery on the central server. Clients are also responsible for granting or denying access over WebRTC.

###Possible Advantages:

* Privacy - outside parties cannot inspect private info
* Data access redundancy - if central server goes down you can still exchange data with others.
* User discovery redundancy - if central server goes down you can still discover other clients.

**Inherent drawbacks:**

* Client must be active (browser window open) to send/receive requests.
* Greater decentralization exposes the peer network (as a whole) to malicious attacks.

##Acknowledgments:

The client-side WebRTC code includes a forked version of PeerJS (<https://github.com/peers/peerjs>).

The Nodetron server code is also a heavily modified fork of PeerJS's PeerServer (<https://github.com/peers/peerjs-server>). Thanks to their great work!

##License:

[Nodetron is released under the MIT license](https://github.com/bchu/nodetron/blob/master/LICENSE).


