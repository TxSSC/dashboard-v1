module.exports = function(emitter, io) {
  var commandeer = io
  .of('/commandeer')
  .on('connection', function(socket) {});

  /**
   * Bind listeners for `events`
   */

  [
    'commandeer:command'
  ].forEach(function(event) {
    emitter.on(event, function() {
      var args = Array.prototype.slice.call(arguments);
      commandeer.emit.apply(commandeer, [event].concat(args));
    });
  });
};