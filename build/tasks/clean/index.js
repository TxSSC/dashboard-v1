/*
 * Adapted from
 * https://github.com/tbranyen/build-tasks/blob/master/clean/index.js
 */
var rimraf = require("rimraf");


task.registerBasicTask("clean", "Deletes out all contents in a directory", function(data, name) {
  var files = file.expand(data);

  task.helper("clean", files);
});

task.registerHelper("clean", function(paths) {

  console.log(paths);
  //rimraf.sync(paths);
});
