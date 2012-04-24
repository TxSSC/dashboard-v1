/**
 * All the potential commands that the client side accepts
 */
var COMMANDS = [
  'watch',
  'clear'
];

module.exports = function(app) {
  return function() {

    /**
     * `POST`
     *
     * @event {trigger} `dashboard:command`, post data
     *
     * Format of `POST` data:
     * {
     *   user: user who issued the command
     *   command: command to execute
     *   data: data associated with the command
     * }
     *
     * Example of `POST`:
     * {
     *   user: 'John',
     *   command: 'display',
     *   data: 'http://www.google.com'
     * }
     */
    this.post(/\/?/, function() {
      var data = this.req.body;

      /**
       * Validate the object and emit the command
       */
      if(data && data.user && data.command) {
        if(~COMMANDS.indexOf(data.command)) {
          app.emitter.emit('commandeer:command', data);
          this.res.writeHead(202, { 'Content-Type': 'application/json' });
          this.res.json({ success: 'command sent to dashboard' });
        }
        else {
          this.res.writeHead(400);
          this.res.json({ error: 'invalid command' });
        }
      }
      else {
        this.res.writeHead(400);
        this.res.json({ error: 'invalid command object'});
      }

      this.res.end();
    });

  };
};