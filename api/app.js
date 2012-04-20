var socket, staticContent, app = {},
    http = require('http'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    io = require('socket.io'),
    director = require('director').http,
    StaticServer = require('node-static').Server,
    EventSub = require('node-redis-events').Subscriber,
    sockets = require('./sockets'),
    controllers = require('./controllers');


/*
 * Initialize all objects on the app and start listening
 */
app.router = new director.Router();
app.http = http.createServer(handler);
socket = app.socket = io.listen(app.http);
app.http.listen(process.env.DASHBOARD_PORT || 3000);

/*
 * Define our event subscriber object, and event emitter
 */
app.subscriber = new EventSub({
  hostname: '127.0.0.1'
});
app.emitter = new EventEmitter();


/**
 * define our namespace 'routes' we want to subscribe to
 *
 * `sockets.SocketController` returns a function for the
 *  subscriber to invoke
 */
app.subscriber.add('tickets', sockets.Tickets(socket));
app.subscriber.add('lunch', sockets.Lunch(socket));
app.subscriber.add('stalker', sockets.Stalker(socket));

/**
 * Bind app events to a socket handler
 */
app.emitter.on('commandeer:command', sockets.Commandeer(socket)('commandeer:command'));


/**
 * Routes
 */
app.router.get(/commandeer\/?/, controllers.Commandeer);

/*
 * Set up our static server
 */
staticContent = new StaticServer(path.join(__dirname, '../client'));

/*
 * Serve static files
 */
function handler(req, res) {
  app.router.dispatch(req, res, function(err) {
    if(err) {
      staticContent.serve(req, res);
    }
  });
}