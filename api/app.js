var socket, app, staticContent,
    http = require('http'),
    path = require('path'),
    io = require('socket.io'),
    StaticServer = require('node-static').Server,
    EventSub = require('node-redis-events').Subscriber,
    sockets = require('./sockets');


/*
 * Start socketio and server
 */
app = http.createServer(handler);
socket = io.listen(app);
app.listen(process.env.DASHBOARD_PORT || 3000);

/*
 * Define our event subscriber object
 */
app.subscriber = new EventSub({
  hostname: '127.0.0.1'
});

/**
 * define our namespace 'routes' we want to subscribe to
 *
 * `sockets.SocketController` returns a function for the
 *  subscriber to invoke
 */
app.subscriber.add('tickets', sockets.Tickets(socket));
app.subscriber.add('lunch', sockets.Lunch(socket));
app.subscriber.add('stalker', sockets.Stalker(socket));

/*
 * Set up our static server
 */
staticContent = new StaticServer(path.join(__dirname, '../client'));

/*
 * Serve static files
 */
function handler(req, res) {
  req.addListener('end', function() {
    staticContent.serve(req, res);
  });
}