module.exports = function(emitter, io) {
  var lunch = io
  .of('/lunch')
  .on('connection', function(socket) {});

  /**
   * Add event listeners for `events` array
   */

  [
    /**
     * Events placeholder
     */
  ].forEach(function(event) {
    emitter.on(event, function() {
      lunch.emit.apply(stalker, Array.prototype.slice.call(arguments));
    });
  });
};