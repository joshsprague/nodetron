#Roadmap

* Authentication.

* IndexedDB and AppCache interfaces.

* Tighter Web Workers integration (i.e. do more with Web Workers).

* Greater decentralization. Read [Notes on Different Approaches](https://github.com/bchu/nodetron/blob/master/docs/Approach.md/), where we discuss several approaches.

* Explore ability for two clients to conduct the WebRTC handshake through a mutual peer.


* Implement a more fully-featured query system:
    * data-key query format (modeled after mongo): `{<key>:<selectors>}`
    if selector is not an object, then direct comparison
    if selector is an object, it will be a series of key-value pairs, where key = selector (i.e. `$gt`), value = comparison value
