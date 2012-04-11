config.init({

  buildDir: 'release/',

  modules: {
    folder: 'modules/'
  },

  clean: {
    release: 'release/**'
  },

  hogan: {
    'release/templates.js': 'app/templates/*.html'
  },

  config: {
    'release/config.js': '../config.json'
  },

  mincss: {
    'release/style.css': [
      'assets/css/bootstrap.css',
      'assets/css/bootstrap-responsive.css',
      'assets/css/style.css'
    ]
  },

  concat: {
    'release/main.js': [
      'app/*.js'
    ]
  },

  watch: {
      files: [ 'modules/**', 'app/*', 'assets/**' ],
      tasks: 'clean modules config mincss concat'
  }

});


task.registerTask(
  'default',
  'clean modules config mincss concat'
);
task.registerTask('release', 'default');
task.registerTask('develop', 'watch');