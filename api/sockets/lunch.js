module.exports = function(emitter, io) {
  var lunch = io
  .of('/lunch')
  .on('connection', function(socket) {});

  /**
   * Add event listeners for `events` array
   */

  [
    'day:new',
    'day:update'
  ].forEach(function(event) {
    emitter.on(event, function() {
      var args = Array.prototype.slice.call(arguments);
      lunch.emit.apply(stalker, [event].concat(args));
    });
  });
};