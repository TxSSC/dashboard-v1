var app = {},
    path = require('path'),
    union = require('union'),
    io = require('socket.io'),
    sockets = require('./sockets'),
    director = require('director').http,
    Emitter = require('node-redis-events'),
    controllers = require('./controllers'),
    StaticServer = require('node-static').Server;


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

/**
 * Define the emitter instance
 */

app.emitter = new Emitter({
  namespace: 'dashboard'
});

/**
 * Listen to our bind our socket events
 */

sockets.Lunch(app.emitter, app.socket);
sockets.Tickets(app.emitter, app.socket);
sockets.Stalker(app.emitter, app.socket);
//sockets.Commandeer(app.emitter, app.socket);

/**
 * Bind app events to a socket handler
 */



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