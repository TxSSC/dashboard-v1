config.init({

  buildDir: 'release/',

  meta: {
    banner: 'derp'
  },

  modules: {
    folder: 'modules/'
  },

  clean: {
    folder: 'release/**',
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


task.registerTask('default', 'clean modules coffee hogan mincss concat');
task.registerTask('dev', 'server watch');