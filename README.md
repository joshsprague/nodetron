#Nodetron

A conceptual overview. Let's see if this is even possible!

###Instructions

1. `grunt client` to run serve client in static server
2. `grunt server` to run server
3. `grunt server-unit` to run server unit tests
4. `grunt client-unit` to run client unit tests
5. `grunt e2e` to run client e2e tests on Chrome (not implemented yet).
6. `grunt cross` to run client e2e tests on Firefox as well as Chrome (not implemented).

More resources:

1. Workflow instructions at <https://github.com/bchu/nodetron/wiki/Workflow>
2. Server-client interface at <https://github.com/bchu/nodetron/wiki/Interface>

##Overview

A peer-to-peer, nearly-server-less, client-side web app framework (library) using WebRTC. Basically a platform upon which other developers can build peer-to-peer, nearly-server-less client-side apps. Applications that are built with this framework will be rich client apps that control and store ALL user state/data locally (possibly through HTML5 IndexedDB or the filesystem sandbox). All data validation and access permissions are handled by the client.

There are several challenges. The first problem is discovery and querying - discovering who else is in the network and how to contact them. For WebRTC, a central server is necessary as a standard "signaling" server that passes along users' requests for connections with each other (there are libraries for this). In the standard model of web applications, that server also is going to store personally identifiable and private info about you - phone numbers, emails, passwords, etc. We want an approach that minimizes involvement of a central server. One problem is we need to find a way for one app to somehow run a query (either p2p or through a server) like so: "connect me with the user whose email is __," since we want data to be decentralized, it would be ideal if the server didn't know the email.

Technologies: WebRTC, MongoDB, Express.js. Possibly Socket.io, HTML5 IndexedDB, AppCache and/or some implementation of a DHT (Kademlia).

Time permitting, a demo/showcase app in AngularJS.

##Deliverables

1. Web Worker abstraction that exposes a mongo, REST-ful, or other-style async API.
    * have dev access html5 IndexedDB directly; OR through wrapper.
2. Web Worker abstraction itself communicates with a server/p2p interface/protocol with which it can
    * register itself as a new client
    * send discovery queries (server or p2p) and cache results (connection info)
    * broadcast/publish information about itself
    * if decentralized, receive info about other nodes and/or respond to discovery queries
    * establish connections and transfer data
3. Server and/or p2p network that:
    * implements NAT traversal (use a library)
    * if decentralized, bootstraps nodes
    * depending on protocol, redirects requests; OR directly transmits connections; OR neither.

##Approach

"Node" is interchangeable with "client".

On a higher level, the range of possible approaches ranges from:

* highly-centralized, MVP-oriented, highly-focused, with lots of coding right out of the gate.
to  
* highly-decentralized, exploration-oriented, breadth-focused, with lots of reading and small technical demos right out of the gate.

**Value propositions:**

The range of approaches has various tradeoffs in our value propositions:

* privacy - outside parties cannot inspect private info
* (server) access redundancy - if central server goes down you can still exchange data with others.
* (server) discovery redundancy - if central server goes down you can still discover other clients.
* security - no single point of attack.

**Inherent drawbacks:**

* Client must be active (browser window open) to send/receive requests.

**Approaches to take and the value propositions present:**

1. Central server stores personally identifiable information in a DB. All queries are handled against this DB. Server routes you. We try to minimize the amount of personal info available, but you still have to authenticate against this server, and give it some private info.
    * pro: some privacy (chats, photos, etc), access redundancy (if you know how to connect with someone already)
    * con: must authenticate, relies on one central server
2. Central server stores only public info available to all. Anyone can query without authenticating.
    * pro: some privacy (less than #1), access redundancy
    * con: limits discoverable vectors, relies on one central server
3. Central server stores hashes of public info, people must know the value of the query.
    * pro, some more privacy, access redundancy
    * con: many categories of hashes vulnerable to dictionary attacks (i.e. city of birth), esp since hashes are public, relies on one central server
4. Central server is only used to redirect queries to ALL nodes. Those nodes respond directly to you.
    * pro: full privacy, access redundancy
    * con: latency inefficient, can't discover offline users

The above approaches are fairly centralized. Now we look at more centralized approaches. Each of these approaches still relies on the central server for NAT traversal and for bootstrapping nodes (introducing a new node to its first node).

5. Each client keeps a local copy of central DB with hashes of public info, continually synced with peers thru WebRTC/initial server
    * pro: full access/discovery redundancy
    * con: many types of hashed info vulnerable to dictionary attacks, large data storage requirement (50-100mb?)
6. Each client keeps a local copy of how to contact each other peer, nothing else, continually synced. Queries are broadcast to everyone in hashed form, then wait for response.
    * pro: full privacy, access/discovery redundancy
    * con: latency/network inefficient, can't discover offline peers
7. Each client keeps full copy of how to contact others, sends a request that is sent to a few nodes and hops around.
   * pro: full privacy, access/discovery redundancy
   * con: security issues (spoofing), latency inefficient, can't discover offline peers.
8. Add a DHT (distributed hash table) with each key as a hashed, stringified query (JSON.stringify({hometown:'Palo Alto'})), and the value as a full list of all users.
    * pro: mostly-full privacy, access/discovery redundancy
    * con: security issues with strength of hashing, large number of keys required (latency inefficient), security issues.

Other approaches off the range:

1. A DHT or central server that stores key-value pairs with the key being a unique id and the value being connection info. Then you must tweet or otherwise send the key to others manually.
2. Use a system of trackers (supernodes, trusted peers) like BitTorrent. App developers would have to set up these trackers.
3. Assume everyone is anonymous and set up interactions with that assumption.
4. Implement a Facebook OpenGraph-like protocol where people are responsible for hosting a reference to their info.
   * or piggyback off FB OG.

##Random Notes:

A DHT is basically a hash table that is split up among all the users (with some redundancy). When you want to find a key in the DHT, you search all the nodes you know about (or some optimized subset). The usual optimization is to have some sort of distance function that gives you log(n) lookup time (a la binary search) - you only search nodes that are "closer" (by some computed function) to the key you want. Those nodes pass along the search. There are open source implementations we can look at.

Speculation: use OAuth for id/key?

Clients might need to mutually pass and store tokens. Spoofing can go in either direction, so requester need to verify requestee, and requestee needs to verify requester.

Have the central server contain users and their associated public keys. Each message a user sends contains a signature that is verified with their private keys. Need to use this method for broadcast methods?

Using a DHT also has major security issues. I think the fact that we only use DHT for routing should ameliorate this issue. The client side will need to have robust access permissions and validation, so that even if a node's routing is hacked the worse case scenario is that the node simply cannot access stuff. A security problem could be that a client could think that route X routes to a trusted friend when in fact that route goes to an attacker, and private data is leaked that way. Solved by signatures?

Also, if multiple apps are using this framework/protocol, need way of distinguishing between requests.

Unique ids - they will simple be randomly generated with a large enough address space as to make collisions statistically improbable (Bitoin does this, as does git).


