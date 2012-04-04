module.exports = function(io) {
  var tickets = io
  .of('/tickets')
  .on('connection', function(socket) {});

  /*
   * This is just an 'event echo handler'
   * being that it just echos events as they come in
   */
  function handler(event, data) {
    console.log(event);
    tickets.emit(event, data);
  }


  //Return handler as the main handler
  return handler;
};