module.exports = function(io) {
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
      commandeer.emit.apply(commandeer, arguments);
    });
  });
};