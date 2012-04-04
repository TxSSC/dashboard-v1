var socket, app, staticContent,
    http = require('http'),
    path = require('path'),
    io = require('socket.io'),
    StaticServer = require('node-static').Server,
    EventSub = require('node-redis-events').Subscriber,
    sockets = require('./sockets');

staticContent = new StaticServer(path.join(__dirname, '../client'));

//Start socketio and server
app = http.createServer(handler);
socket = io.listen(app);
app.listen(process.env.PORT || 2000);

/*
 * Define our event subscriber object
 */
app.subscriber = new EventSub({
  hostname: '127.0.0.1'
});

//define our namespace 'routes' we want to subscribe to
app.subscriber.add('tickets', sockets.Tickets(socket));
app.subscriber.add('lunch', sockets.Lunch(socket));


/*
 * Default handler for the server
 */
function handler(req, res) {
  req.addListener('end', function() {
    staticContent.serve(req, res);
  });
}