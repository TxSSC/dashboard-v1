var http = require('http');

module.exports = function(io) {
  var lunch = io
  .of('/lunch')
  .on('connection', function(socket) {

    /*
     * emit the current day on connection
     */
    fetchDay(function(day) {
      socket.emit('day:new', day);
    });

  });

  function handler(event, data) {
    lunch.emit(event, data);
  }

  //Return handler as the main handler
  return handler;
};


function fetchDay(callback) {
  var options = {
    host: process.env.LUNCH_SERVER,
    port: process.env.LUNCH_PORT,
    path: '/lunch'
  };

  http.get(options, function(res) {
    return callback(JSON.parse(res));
  });
}