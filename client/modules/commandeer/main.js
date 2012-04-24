(function() {
  var socket = io.connect('/commandeer');

  /**
   * Command model - only holds the current command
   */
  var Command = Backbone.Model.extend({
    initialize: function() {
      var self = this;

      socket.on('commandeer:command', function(data) {
        self.set(data);
      });
    }
  });

  /**
   * Command view
   * this view hides manipulates #main
   */
  var CommandView = Backbone.View.extend({
    id: 'commandeer',

    initialize: function() {
      this.model = new Command();
      this.model.on('change', this.execCommand, this);
    },

    /**
     * Render a youtube watch command if `model.command` is `watch`
     */
    watch: function() {
      var self = this;
      this.$el.html(Templates.commandeer.youtube.render(this.model.toJSON()));

      $('#main').fadeOut(200, function() {
        $('body').prepend(self.$el);
      });
    },

    execCommand: function() {
      var model = this.model;

      switch(model.get('command')) {
        case 'watch':
          this.watch();
          break;
        case 'clear':
          this.$el.empty();
          $('#main').fadeIn(200);
          break;
        default:
          break;
      }
    }
  });


  return CommandView;

}).call(this);