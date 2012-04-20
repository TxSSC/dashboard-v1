module.exports = function(io) {
  var commandeer = io
  .of('/commandeer')
  .on('connection', function(socket) {});

  /**
   * Simple handler to send data to the client
   */
  function handler(event, data) {
    commandeer.emit(event, data);
  }


  //Wrap handler to proxy the event
  return function(event) {
    return function(data) {
      return handler(event, data);
    };
  };
};