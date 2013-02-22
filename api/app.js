var app = {},
    path = require('path'),
    union = require('union'),
    io = require('socket.io'),
    sockets = require('./sockets'),
    director = require('director').http,
    Emitter = require('node-redis-events'),
    controllers = require('./controllers'),
    redis = require('redis').createClient(),
    StaticServer = require('node-static').Server;


/*
 * Initialize all objects on the app
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
 * Define the emitter instance for the local application
 */

app.emitter = new Emitter({
  redis: redis,
  namespace: 'dashboard'
});

/**
 * Create our emitters for specific namespaces and
 * initialize socket listeners.
 */

sockets.Commandeer(app.emitter, app.socket);
sockets.Lunch(new Emitter({redis: redis, namespace: 'lunch'}), app.socket);
sockets.Tickets(new Emitter({redis: redis, namespace: 'tickets'}), app.socket);
sockets.Stalker(new Emitter({redis: redis, namespace: 'stalker'}), app.socket);

/**
 * Routes
 */

app.router.path(/commandeer\/?/, controllers.Commandeer(app));

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