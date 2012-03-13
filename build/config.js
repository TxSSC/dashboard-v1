config.init({

  buildDir: 'release/',

  modules: {
    folder: 'modules/'
  },

  clean: {
    folder: 'release/',
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

  server: {
    release: {
      'app': 'release/',
      'app/templates': 'release/templates'
    }
  }

});

//FUCK CLEAN
task.registerTask('default', 'modules coffee hogan mincss concat');