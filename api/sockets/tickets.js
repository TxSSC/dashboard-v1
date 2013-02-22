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
    emitter.addListener(event, function() {
      tickets.emit.apply(tickets, Array.prototype.slice.call(arguments));
    });
  });
};