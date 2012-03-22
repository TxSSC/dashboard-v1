config.init({

  buildDir: 'release/',

  modules: {
    folder: 'modules/'
  },

  clean: {
    release: 'release/**',
    compiled: [
      'app/Main.js'
    ]
  },

  coffee: {
    folder: 'app/*.coffee'
  },

  hogan: {
    'release/templates.js': 'app/templates/*.html'
  },

  mincss: {
    'release/style.css': [
      'assets/css/bootstrap.css',
      'assets/css/bootstrap-responsive.css',
      'assets/css/style.css'
    ]
  },

  concat: {
    'release/app.js': [
      'app/*.js'
    ]
  },

  watch: {
      files: [ 'modules/**', 'app/*', 'assets/**' ],
      tasks: 'modules coffee hogan mincss concat clean:compiled'
  },

  server: {
    dev: {
      'app': 'release/'
    }
  }

});


task.registerTask(
  'default',
  'clean:release modules coffee hogan mincss concat clean:compiled'
);
task.registerTask('dev', 'server:dev watch');