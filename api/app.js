var app = {},
    union = require('union'),
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
app.staticServer = new StaticServer(path.join(__dirname, '../client'));
app.router = new director.Router();
app.server = union.createServer({
  before: [ handler ]
});

/**
 * Configure socket.io
 */
app.socket = io.listen(app.server);
app.socket.enable('browser client minification');
app.socket.enable('browser client etag');
app.socket.enable('browser client gzip');
app.socket.set('log level', 1);
app.socket.set('transports', [ 'websocket', 'xhr-polling' ]);

/**
 * Start listening on DASHBOARD_PORT
 */
app.server.listen(process.env.DASHBOARD_PORT || 3000);

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
app.subscriber.add('tickets', sockets.Tickets(app.socket));
app.subscriber.add('lunch', sockets.Lunch(app.socket));
app.subscriber.add('stalker', sockets.Stalker(app.socket));

/**
 * Bind app events to a socket handler
 */
app.emitter.on('commandeer:command', sockets.Commandeer(app.socket)('commandeer:command'));


/**
 * Routes
 */
app.router.path(/commandeer\/?/, controllers.Commandeer(app));

/*
 * Set up our static server
 */


/*
 * Default http handler
 */
function handler(req, res) {
  app.router.dispatch(req, res, function(err) {
    if(err) {
      app.staticServer.serve(req, res);
    }
  });
}