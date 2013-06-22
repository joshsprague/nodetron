#Nodetron

A distributed, nearly-server-less client-side web app framework using WebRTC and a DHT (distributed hash table) as routing. Applications will be rich client applications that communicate peer-to-peer. Each client will control its own data and control access to it. Let's see if this is even possible!

##Random notes on approach and challenges:

"Node" is interchangeable with "client".

*Three workarounds/alternatives to some of the various problems outlined*:

1. Assume anonymity - no such concept as mutual verification/authentication
2. Ditch the DHT and just use a central signaling server for everything.
3. Use trackers (trusted servers that refer peers to each other - there can be several) like BitTorrent. Users of this framework have to set these up themselves (we can set up a basic one).

A DHT is basically a hash table that is split up among all the users (with some redundancy). When you want to find a key in the DHT, you search all the nodes you know about (or some optimized subset). The usual optimization is to have some sort of distance function that gives you log(n) lookup time (a la binary search) - you only search nodes that are "closer" (by some computed function) to the key you want. Those nodes pass along the search. There are open source implementations we can look at.

The DHT will record all available resources (key = user_id, value = resources available and requestable).

This is *nearly* server-less because a central server/list will probably be needed to bootstrap a node (tell a new node about some other nodes, since new nodes don't know any other nodes). And provide NAT handling (I have no idea what that entails, just something I read). Not sure about this; investigate alternatives.

Speculation: use OAuth for id/key?

Clients will need to mutually pass and store tokens. Spoofing can go in either direction, so requester need to verify requestee, and requestee needs to verify requester.

Client-side tech to look at: HTML5 IndexedDB, AppCache, filesystem sandbox.

Another drawback: client must be active (browser window open) to send/receive requests.

Clients still need to know the key for a user - needs to be a way to discover users. Public broadcast? But then attackers can mimic id's. Public broadcast with associated public keys.

Have a central server that contains users and their associated public keys. Each message a user sends contains a signature that is verified with their private keys. - solves user verification issue

Using a DHT also has major security issues. I think the fact that we only use DHT for routing should ameliorate this issue. The client side will need to have robust access permissions and validation, so that even if a node's routing is hacked the worse case scenario is that the node simply cannot access stuff.

Actually, a security problem could be that a client could think that route X routes to a trusted friend when in fact that route goes to an attacker. Is this solved by passing tokens?

Also, if multiple apps are using this framework/protocol, need way of distinguishing between requests.

Unique ids - they will simple be randomly generated with a large enough address space as to make collisions statistically improbably (Bitoin does this)

Another feature: querying nodes. Let's say you know your friend's email. The user list that all users have only has three pieces of info: public key, route (ip+port), and another key that authenticates this app as being actually what it is (?).
You send out a hashed version of their email. The node that responds with the right email is verified as your friend.


