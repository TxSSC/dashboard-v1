config.init({

  buildDir: 'release/',

  modules: {
    folder: 'modules/'
  },

  clean: {
    folder: 'release/'
  },

  coffee: {
    folder: 'app/*'
  },

  concat: {
    'release/release.js': 'app/*.js',
    'release/style.css': 'app/*.css'
  }

});


task.registerTask('default', 'clean modules concat');