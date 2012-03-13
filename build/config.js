config.init({

  buildDir: 'release/',

  modules: {
    folder: 'modules/'
  },

  clean: {
    release: 'release/**',
    compiled: [
      'app/ModularView.js',
      'app/ViewFactory.js'
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
      'assets/css/*.css'
    ]
  },

  concat: {
    'release/app.js': [
      'app/*.js'
    ]
  },

  watch: {
      files: [ '<config:modules.folder>/**', 'app/*' ],
      tasks: 'modules coffee hogan concat'
  },

  server: {
    release: {
      'app': 'release/',
      'app/modules': 'release/modules/'
    }
  }

});


task.registerTask(
  'default',
  'clean:release modules coffee hogan mincss concat clean:compiled'
);
task.registerTask('dev', 'server watch');