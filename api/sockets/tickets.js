module.exports = function(io) {
  var tickets = io
  .of('/tickets')
  .on('connection', function(socket) {});

  /*
   * Process the event and pass the `data` we want to
   * the client.
   *
   * @param {event} - The event that fired
   * @param {data} - Object or string
   *
   * If `data` is an object, data.body is used
   * If `data` is a string, the string itself is used
   */
  function handler(event, data) {
    if(typeof(data) === 'object' && data.body) {
      data = data.body;
    }

    tickets.emit(event, data);
  }


  //Return handler as the main handler
  return handler;
};