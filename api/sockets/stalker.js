module.exports = function(emitter, io) {
  var stalker = io
  .of('/stalker')
  .on('connection', function(socket) {});

  /**
   * Add event listeners for `events` array
   */

  [
    'user:new'
  ].forEach(function(event) {
    emitter.on(event, function() {
      stalker.emit.apply(stalker, Array.prototype.slice.call(arguments));
    });
  });
};