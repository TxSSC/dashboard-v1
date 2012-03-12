var fs = require('fs'),
    path = require('path');


task.registerBasicTask('modules', 'Compile modules into one file', function(data, name) {
  var modules,
      module_dir = path.resolve(data);

  modules = fs.readdirSync(module_dir).map(function(folder) {
    return path.join(module_dir, folder);
  }).filter(function(thing) {
    return fs.statSync(thing).isDirectory();
  });

  console.dir(modules);

});