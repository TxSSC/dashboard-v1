var http = require('http');

module.exports = function(io) {
  var lunch = io
  .of('/lunch')
  .on('connection', function(socket) {});

  /*
   * Process the event and pass the `data` we want to
   * the client.
   *
   * @param {event} - The event that fired
   * @param {data} - Object
   */
  function handler(event, data) {
    lunch.emit(event, data);
  }

  /*
   * Return handler as the main handler
   */
  return handler;
};