/*
 * Build modules from their module.json file
 */

task.registerBasicTask('modules', 'Build all modules', function(data, name) {
  var baseDir = data,
      modules = file.expand(data + '*/*.json');

  modules.forEach(function(config) {
    task.helper('module', config);
  });
});



task.registerHelper('module', function(path) {
  //Do module things dependent of each module

  console.dir(file.readJson(path));
});