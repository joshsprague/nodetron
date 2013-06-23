#Nodetron

A conceptual overview. Let's see if this is even possible!

##Overview

A peer-to-peer, nearly-server-less, client-side web app framework (library) using WebRTC. Basically a platform upon which other developers can build peer-to-peer, nearly-server-less client-side apps. Applications that are built with this framework will be rich client apps that control and store ALL user state/data locally (possibly through HTML5 IndexedDB or the filesystem sandbox). All data validation and access permissions are handled by the client.

One possible direction towards even less reliance on a server is to implement some sort of DHT (distributed hash table).

There are several challenges. The first problem is discovery and querying - discovering who else is in the network and how to contact them. For WebRTC, a central server is necessary as a standard "signaling" server that passes along users' requests for connections with each other (there are libraries for this). One problem is we need to find a way for one app to query the server like so: "connect me with the user whose email is __," since we want data to be decentralized -  the server shouldn't know the email.

One possibility: Joe has the app open in his browser and he wants data from Sarah and knows her email. He sends (a hash?) of her email to the server (which has a hash of all the emails of all users?). Then the request is routed to Sarah. Sarah can accept or decline. The server then handles giving Joe/Sarah info about connecting with each other if Sarah accepts.

Another possibility: Joe sends the server a hash of Sarah's email. The server sends that hash and some metadata to every client. When Sarah's client recognizes the hash as her email's hash, Sarah makes a request to Joe with the unhashed email (so Joe can verify Sarah).

Technologies: WebRTC, MongoDB, Express.js. Possibly Socket.io, HTML5 IndexedDB, AppCahce and/or some implementation of a DHT.

If we have time, a demo/showcase app in AngularJS.

##Random notes on approach and challenges:

"Node" is interchangeable with "client".

*Two workarounds/alternatives to some of the various problems outlined*:

1. Assume anonymity - no such concept as mutual verification/authentication
2. Use trackers (trusted servers that refer peers to each other - there can be several) like BitTorrent. Users of this framework have to set these up themselves (we can set up a basic one).

Introducing a DHT brings up a lot of security/verification issues.

A DHT is basically a hash table that is split up among all the users (with some redundancy). When you want to find a key in the DHT, you search all the nodes you know about (or some optimized subset). The usual optimization is to have some sort of distance function that gives you log(n) lookup time (a la binary search) - you only search nodes that are "closer" (by some computed function) to the key you want. Those nodes pass along the search. There are open source implementations we can look at.

The DHT will record all available resources. Unsure of what the key-value pairs will consist of.

Investigate whether a central server is really necessary for 1) NAT traversal, and 2) listing all users. Can NAT traversal and SDP (Session Description Protocol) be negotiated by the network?

Speculation: use OAuth for id/key?

Another feature: querying nodes. Let's say you know your friend's email. The user list that all users have only has three pieces of info: public key, connection info(?), and another key that authenticates this app as being actually what it is (?).
You send out a hashed version of their email. The node that responds with the right email is verified as your friend. Or do a broadcast/propagation to all nodes, the node that returns the answer to the hash is the right target.

Clients might need to mutually pass and store tokens. Spoofing can go in either direction, so requester need to verify requestee, and requestee needs to verify requester.

Another drawback: client must be active (browser window open) to send/receive requests.

Clients still need to know the key for a user - needs to be a way to discover users. Public broadcast? But then attackers can mimic id's. Public broadcast with associated public keys?

Have the central server contain users and their associated public keys. Each message a user sends contains a signature that is verified with their private keys.

Using a DHT also has major security issues. I think the fact that we only use DHT for routing should ameliorate this issue. The client side will need to have robust access permissions and validation, so that even if a node's routing is hacked the worse case scenario is that the node simply cannot access stuff.

Actually, a security problem could be that a client could think that route X routes to a trusted friend when in fact that route goes to an attacker. Solved by signatures?

Also, if multiple apps are using this framework/protocol, need way of distinguishing between requests.

Unique ids - they will simple be randomly generated with a large enough address space as to make collisions statistically improbably (Bitoin does this)