config.init({
  modules: {
    dir: 'modules/',
    tasks: [ 'test'
    ]
  },
  clean: {
    folder: 'build/'
  }

});


task.registerTask('default', function() {
  console.log('testing');
});