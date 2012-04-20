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
      var data = this.res.body;

      /**
       * Send the data to the socket controller
       */
      app.emitter.emit('dashboard:command', data);
    });

  };
};