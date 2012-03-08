config.init({

  modules:
  {
    dir: 'modules/'
  },

  clean:
  {
    folder: 'build/'
  },

  coffee:
  {
    folder: 'support/*'
  }

});


task.registerTask('default', function() {
  console.log('testing');
});