module.exports = function(emitter, io) {
  var stalker = io
  .of('/stalker')
  .on('connection', function(socket) {});

  /**
   * Add event listeners for `events` array
   */

  [
    'user:save',
    'user:update'
  ].forEach(function(event) {
    emitter.on(event, function() {
      var args = Array.prototype.slice.call(arguments);
      stalker.emit.apply(stalker, [event].concat(args));
    });
  });
};