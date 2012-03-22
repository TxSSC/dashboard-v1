(function(lab) {
  var deps = [
    '/assets/js/jquery.js',
    '/assets/js/jquery.masonry.js',
    '/assets/js/underscore.js',
    '/assets/js/hogan.js',
  ];

  lab
  .script(deps)
  .script('/assets/js/backbone.js').wait()
  .script('/release/modules/module-templates.js').wait()
  .script('/release/modules/module-main.js').wait()
  .wait(function() {

    window.Dashboard = {
      Views: []
    };

    var $container = $('#main');

    $container.hide().masonry({
      isAnimated: true
    });

    Object.keys(modules).forEach(function(module) {
      if(typeof(modules[module]) === 'function') {
        var newView = new modules[module]();
        Dashboard.Views.push(newView);
        $container.append(newView.render().$el);
      }
    });

    setTimeout(function() {
      return $container.show().masonry('reload');
    }, 200);

  });

}).call(this, $LAB);