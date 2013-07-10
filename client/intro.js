// meant for concatenation. See outro.js for the end of this IIFE.

window.nodetron = (function(window) {
  var obj = {
    uuid: window.uuid
  };
  window.uuid = null;
  return obj;
})(this);

(function(nodetron) {

