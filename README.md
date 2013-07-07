#Nodetron

**This project is under heavy development. Its API is subject to major, breaking changes.**

A peer-to-peer, nearly-serverless, rich-client web app library using HTML5, WebRTC, WebWorkers, and IndexedDB.

####[Full API Documentation](/docs/API Documentation.md/)
####[A Discussion of Our Approach](/docs/Our Approach.md/)

###Build and Run Instructions

* `npm install && bower install`
* `git submodule init && git submodule update --remote`
* For debugging, install global dependencies: `npm -g install node-inspector`
* Always use `git submodule update --remote` to update the demo submodule.

1. `grunt all` to run server and serve client with static server.
    * Append `:<number>` to specify how many client instances you want to run.
    * Append `:debug` to run node-inspector as well.
    * Ex: `grunt:4:debug` runs 4 client instances at ports 9000-9004 and runs node-inspector.
2. `grunt client` to serve client with static server.
    * Append `:unit` to run unit tests.
3. `grunt server` to run server.
    * Append `:unit` to run unit tests.
    * Append `:debug` to run node-inspector.
4. `grunt e2e` to run client e2e tests on Chrome (not implemented yet).
5. `grunt cross` to run client e2e tests on Firefox as well as Chrome (not implemented yet).

If you get a `Error: Cannot find module './build/Debug/DTraceProviderBindings'` error, remove `restify` from your local `node_modules` folder and re-run `npm install` in the project root.

More resources:

1. Workflow instructions at <https://github.com/bchu/nodetron/wiki/Workflow>
2. Server-client interface at <https://github.com/bchu/nodetron/wiki/Interface>

###Deployment Instructions (Jitsu)
1. Install the jitsu package using `npm install -g jitsu`
    * supply any necessary credentials.
2. Login using `jitsu login`
3. Deploy using `jitsu deploy`.
4. Current domain: http://bsalazar91-server.jit.su at port:80 and http://nodetron.jit.su at port:80.

###Overview

A peer-to-peer, nearly-serverless, rich client web app library using WebRTC, WebWorkers, and IndexedDB. Developers can use this to easily create peer-to-peer applications that do more than just transfer files. Developers will build rich client apps that control and store ALL user state/data locally (through HTML5 IndexedDB and/or the filesystem sandbox). All data validation and access permissions are handled by the client.

**Challenges:**

1. In most WebRTC implementations, a central server is necessary as a standard "signaling" server that passes along users' requests for connections with each other (there are libraries for this). In the standard model of web applications, that server also is going to store personally identifiable and private info about you - phone numbers, emails, passwords, etc. We want an approach that minimizes involvement of a central server. One challenge is to find a way for one app to somehow run a query (either p2p or through a server) like so: "connect me with the user whose email is __," since we want data to be decentralized, it would be ideal if the server didn't know the email.

Technologies: WebRTC, HTML5 IndexedDB, Socket.io, MongoDB, Express.js, and/or some implementation of a DHT (Kademlia).


###Current Architecture

Clients send 'discovery queries' to a central server/database. The server responds with potential matches. Clients then contact the matches directly over WebRTC and exchange information. Clients specify what information they make publicly available for discovery on the central server. Clients are also responsible for granting, denying, or upgrading access over WebRTC.

###Value proposition:

* privacy - outside parties cannot inspect private info
* (server) access redundancy - if central server goes down you can still exchange data with others.
* (server) discovery redundancy - if central server goes down you can still discover other clients.
* security - no single point of attack.

**Inherent drawbacks:**

* Client must be active (browser window open) to send/receive requests.

**Browser Compatibility**

* Web Workers: IE10+
* IndexedDB: IE10+, should use moz/webkit prefixes, FF10+, CH23+, no Safari
    * WebSQL shim for Safari and mobile
* WebRTC: no IE, FF20+, CH26+, no Safari.

##Acknowledgments:

90% of server code is forked from PeerJS Server (https://github.com/peers/peerjs-server). Thanks to their great work!

