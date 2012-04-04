module.exports = function(io) {
  var tickets = io
  .of('/tickets')
  .on('connection', function(socket) {

    //Bootstrap tickets?

  });

  function handler(event, data) {
    console.log(event);
    tickets.emit(event, data);
  }


  //Return handler as the main handler
  return handler;
};