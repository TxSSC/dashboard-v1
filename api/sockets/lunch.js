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


function fetchDay(callback) {
  var options = {
    host: process.env.LUNCH_HOST,
    port: process.env.LUNCH_PORT,
    path: '/lunch'
  };

  http.get(options, function(res) {
    if(res.statusCode === 200) {
      var json = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        json += chunk;
      });

      res.on('end', function() {
        return callback(JSON.parse(json));
      });
    }
  });
}