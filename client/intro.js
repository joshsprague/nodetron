// meant for concatenation. See outro.js for the end of this IIFE.

window.nodetron = (function(window) {
  var obj = {
    uuid: window.uuid
  };
  window.uuid = null;
  return obj;
})(this)


/*
WIP
// Credit goes to jQuery: https://github.com/jquery/jquery/blob/master/src/outro.js
(function (window,factory) {
  if ( typeof module === "object" && typeof module.exports === "object" ) {
    // Expose a factory as module.exports in loaders that implement the Node
    // module pattern (including browserify).
    // This accentuates the need for a real window in the environment
    // e.g. var nodetron = require("nodetron")(window);
    module.exports = function( w ) {
      w = w || window;
      if ( !w.document ) {
        throw new Error("Nodetron requires a window with a document");
      }
      return factory( w );
    };
  } else {
    // Execute the factory to produce Nodetron
    var nodetron = factory( window );

    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase nodetron is used because AMD module names are
    // derived from file names, and Nodetron is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of Nodetron, it will work.
    if ( typeof define === "function" && define.amd ) {
      define( "nodetron", [], function() {
        return nodetron;
      });
    }
  }

// Pass this, window may not be defined yet
}(this, function ( window, undefined ) {
*/

(function(nodetron) {

