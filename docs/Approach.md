#Notes on Different Approaches

*This doc is somewhat outdated (i.e. some of these approaches are considered unfeasible)*.

**Challenges:**

1. In most WebRTC implementations, a central server is necessary as a standard "signaling" server that passes along users' requests for connections with each other (there are libraries for this). In the standard model of web applications, that server also is going to store personally identifiable and private info about you - phone numbers, emails, passwords, etc. We want an approach that minimizes involvement of a central server. One challenge is to find a way for one app to somehow run a query (either p2p or through a server) like so: "connect me with the user whose email is __," since we want data to be decentralized, it would be ideal if the server didn't know the email.

##Project Goals

At the outset of this program, we set out to create:

1. A Web Worker abstraction that exposes an async API.

2. A Web Worker abstraction itself communicates with a server/P2P interface/protocol with which it can:
    * register itself as a new client
    * send discovery queries (server or P2P) and cache results (connection info)
    * broadcast/publish information about itself
    * if decentralized, receive info about other nodes and/or respond to discovery queries
    * establish connections and transfer data
3. A Server and/or P2P network that:
    * implements NAT traversal (via a library)
    * if decentralized, bootstraps nodes
    * depending on protocol, routes requests
    * allows peers to discover each-other based on the metadata they make public.

###Potential solutions and their associated benefits / disadvantages

1. Central server stores personally identifiable information in a DB. All queries are handled against this DB. Server routes you. We try to minimize the amount of personal info available, but you still have to authenticate against this server, and give it some private info.
    * __pro__: some privacy (chats, photos, etc), access redundancy (if you know how to connect with someone already)
    * __con__: must authenticate, relies on one central server
2. Central server stores only public info available to all. Anyone can query without authenticating.
    * __pro__: some privacy (less than #1), access redundancy
    * __con__: limits discoverable vectors, relies on one central server
3. Central server stores hashes of public info, people must know the value of the query.
    * __pro__, some more privacy, access redundancy
    * __con__: many categories of hashes vulnerable to dictionary attacks (i.e. city of birth), esp since hashes are public, relies on one central server
4. Central server is only used to redirect queries to ALL nodes. Those nodes respond directly to you.
    * __pro__: full privacy, access redundancy
    * __con__: latency inefficient, can't discover offline users

__The above approaches are fairly centralized. Now we look at more centralized approaches. Each of these approaches still relies on the central server for NAT traversal and for bootstrapping nodes (introducing a new node to its first node).__

5. Each client keeps a local copy of central DB with hashes of public info, continually synced with peers thru WebRTC/initial server
    * __pro__: full access/discovery redundancy
    * __con__: many types of hashed info vulnerable to dictionary attacks, large data storage requirement (perhaps 50 to 100mb?)
6. Each client keeps a local copy of how to contact each other peer, nothing else, continually synced. Queries are broadcast to everyone in hashed form, then wait for response.
    * __pro__: full privacy, access/discovery redundancy
    * __con__: latency/network inefficient, can't discover offline peers
7. Each client keeps full copy of how to contact others, sends a request that is sent to a few nodes and hops around.
   * __pro__: full privacy, access/discovery redundancy
   * __con__: security issues (spoofing), latency inefficient, can't discover offline peers.
8. Add a DHT (distributed hash table) with each key as a hashed, stringified query (JSON.stringify({hometown:'Palo Alto'})), and the value as a full list of all users.
    * __pro__: mostly /full privacy, access/discovery redundancy
    * __con__: security issues with strength of hashing, large number of keys required (latency inefficient), security issues.

__Other potential approaches outside of the buckets above:__

1. A DHT or central server that stores key-value pairs with the key being a unique id and the value being connection info. Then you must tweet or otherwise send the key to others manually.
2. Use a system of trackers (supernodes, trusted peers) like BitTorrent. App developers would have to set up these trackers.
3. Assume everyone is anonymous and set up interactions with that assumption.
4. Implement a Facebook OpenGraph-like protocol where people are responsible for hosting a reference to their info (or piggybback off of facebook open graph);

###Musings on Distributed Hash Tables (DHTs):

A DHT is a hash table that is split up among all the users (with some redundancy). When you want to find a key in the DHT, you search all the nodes you know about (or some optimized subset). The usual optimization is to have some sort of distance function that gives you log(n) lookup time (a la binary search) you only search nodes that are "closer" (by some computed function) to the key you want. Those nodes pass along the search. There are open source implementations the could potentially be used here.

Clients might need to mutually pass and store tokens. Spoofing can go in either direction, so requester need to verify requestee, and requestee needs to verify requester.

Have the central server contain users and their associated public keys. Each message a user sends contains a signature that is verified with their private keys. Need to use this method for broadcast methods?

Using a DHT also has major security issues. I think the fact that we only use DHT for routing should ameliorate this issue. The client side will need to have robust access permissions and validation, so that even if a node's routing is hacked the worse case scenario is that the node simply cannot access stuff. A security problem could be that a client could think that route X routes to a trusted friend when in fact that route goes to an attacker, and private data is leaked that way. Solved by signatures?

Also, if multiple apps are using this framework/protocol, need way of distinguishing between requests.
