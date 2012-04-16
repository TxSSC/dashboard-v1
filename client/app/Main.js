(function(lab) {
  var deps = [
    '/assets/js/jquery.js',
    '/assets/js/underscore.js',
    '/assets/js/hogan.js',
    '/assets/js/raphael-min.js',
    '/assets/js/highcharts.js',
    '/socket.io/socket.io.js'
  ];

  lab
  .script(deps)
  .script('/assets/js/backbone.js').wait()
  .script('/release/config.js').wait()
  .script('/release/modules/module-templates.js').wait()
  .script('/release/modules/module-main.js').wait()
  .wait(function() {

    /**
     * Make jsonp the default request method
     */
    Backbone.old_sync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
      var opts = _.extend({
        timeout: 10000,
        dataType: 'jsonp'
      }, options);

      return Backbone.old_sync(method, model, opts);
    };

    /**
     * Initialize dashboard
     */
    $(document).ready(function() {

      var Dashboard = {
        Views: []
      };

      var $container = $('#main');

      var layoutOrder = ['weather', 'ticket_system', 'lunch', 'calendar', 'stalker'];

      layoutOrder.forEach(function(module) {
        if(typeof(modules[module]) === 'function') {
          var newView = new modules[module]();
          Dashboard.Views.push(newView);
          $container.append(newView.$el);
        }
      });

    });

  });

}).call(this, $LAB);