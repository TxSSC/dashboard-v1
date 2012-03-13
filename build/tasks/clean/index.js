/*
 * https://github.com/tbranyen/build-tasks/blob/master/clean/index.js
 * Adapted from
 */



task.registerBasicTask("clean", "Deletes out all contents in a directory", function(data, name) {
  var folder = path.resolve(data);

  console.dir(folder);

  // Delete all files inside the folder
  task.helper("clean", folder);
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper("clean", function(folder) {
  var rimraf = require("rimraf");

  //rimraf.sync(folder);
});
