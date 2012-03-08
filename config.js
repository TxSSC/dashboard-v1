config.init({

  build_dir: 'release/',

  modules: {
    dir: 'modules/'
  },

  clean: {
    folder: 'build/'
  },

  coffee: {
    folder: 'app/*'
  },

  concat: {
    'release/release.js': 'release/modules/js/*.js',
    'release/module_styles.css': 'release/modules/css/*.css',
    'release/templates.js': 'release/modules/templates/*.hogan'
    // dist: {
    //   src: 'release/modules/*.js',
    //   dest: 'release/release.js'
    // },
    // css: {
    //   src: 'release/modules/*.css',
    //   dest: 'release/style.css'
    // },
    // templates: {
    //   src: 'release/modules/*.hogan',
    //   dest: 'release/templates.js'
    // }
  }

});


task.registerTask('default', 'clean modules concat');