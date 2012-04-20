/**
 * Dashboard `remote` controller
 */

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
      if(data.user && data.command) {
        app.emitter.emit('commandeer:command', data);
        this.res.writeHead(202, { 'Content-Type': 'application/json' });
      }
      else {
        this.res.writeHead(400);
      }

      this.res.end();
    });

  };
};