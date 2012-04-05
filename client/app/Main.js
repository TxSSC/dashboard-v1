(function(lab) {
  var deps = [
    '/assets/js/jquery.js',
    '/assets/js/underscore.js',
    '/assets/js/hogan.js',
    '/assets/js/raphael-min.js',
    '/assets/js/highcharts.js'
  ];

  lab
  .script(deps)
  .script('/assets/js/backbone.js').wait()
  .script('/release/config.js').wait()
  .script('/release/modules/module-templates.js').wait()
  .script('/release/modules/module-main.js').wait()
  .wait(function() {

    var Dashboard = {
      Views: []
    };

    var $container = $('#main');

    var layoutOrder = ['weather'];

    layoutOrder.forEach(function(module) {
      if(typeof(modules[module]) === 'function') {
        var newView = new modules[module]();
        Dashboard.Views.push(newView);
        $container.append(newView.$el);
      }
    });

  });

}).call(this, $LAB);