var fs = require('fs'),
    grunt = require('grunt');


var taskList = fs.readdirSync(__dirname + '/tasks').filter(function(task) {
  return fs.statSync(__dirname + '/tasks/' + task).isDirectory();
}).map(function(task) {
  return 'tasks/' + task;
});


grunt.cli({
  base: './',
  config: './config.js',
  tasks: taskList
}, function() {});