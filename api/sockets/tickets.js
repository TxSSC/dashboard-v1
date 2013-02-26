module.exports = function(emitter, io) {
  var tickets = io
  .of('/tickets')
  .on('connection', function(socket) {});

  /**
   * Add listeners from `event` array
   */

  [
    'ticket:new',
    'ticket:update',
    'ticket:remove',
    'comment:new',
    'comment:update',
    'comment:remove'
  ].forEach(function(event) {
    emitter.on(event, function() {
      var args = Array.prototype.slice.call(arguments);
      tickets.emit.apply(tickets, [event].concat(args));
    });
  });
};