##Inter-client communication:

###Request-response-access protocol for communicating between clients over WebRTC

Request for access to X:

Request:

    {
      method:<method>,
      resource:<resource>,
      data:<object>,
      identify:<object>
    }

* method: get,post,put,delete (get, add, update or add, delete)
* resource: name of resource (maps to db)
* data: if get, a query; if post, an object; if put, an object; if delete, a query.
* identify: object containing key-value pairs of data about the originator (including any auth tokens)
* data-key query format (modeled after mongo): {<key>:<selectors>}
    if selector is not an object, then direct comparison
    if selector is an object, it will be a series of key-value pairs, where key=selector (i.e. "$gt"), value=comparison value

Response format:

    {
      response:<string>,
      data:<data>
    }

* response: literal string: 'accept' or 'deny'
* data: if accept, the data requested; if deny, an error code
