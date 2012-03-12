/*
 * Build modules from their module.json file
 */
var fs = require('fs'),
    path = require('path');


task.registerBasicTask('modules', 'Build all modules', function(data, name) {
  var modules,
      build_dir = config('build_dir') || 'build/',
      module_dir = path.resolve(data);

  modules = fs.readdirSync(module_dir).filter(function(node) {
    return fs.statSync(path.join(module_dir, node)).isDirectory();
  }).map(function(folder) {
    return path.join(module_dir, folder);
  });

  build_dir = path.resolve(build_dir);

  modules.forEach(function(module) {
    task.helper('module', module, build_dir);
  });

});


/*
 * This helper should be called with the path to the
 * module to build, and the build directory.
 *
 * This will build everything into a module/tmp directory,
 * and then move it to the build_dir
 */
task.registerHelper('module', function(module_path, build_path) {
  //Make sure this is a valid module path
  if(!path.existsSync(path.join(module_path, 'module.json'))) {
    log.error(module_path + ' - is not a module.');
    return false;
  }

  var tasks,
      tmp_dir = path.join(module_path, 'tmp'),
      config = file.readJson(path.join(module_path, 'module.json'));

  //Set up the module with config
  if(config.name) {
    config.name = slugName(config.name);
  }
  else {
    log.error(module_path + ' - module name must be defined.');
    return false;
  }

  tasks = expandTasks(module_path, config.tasks);

  //Compile source code
  if(tasks.coffee || tasks.js) {
    var files;

    if(tasks.coffee) {
      //Compile coffee
      files = task.helper('coffee', tasks.coffee, tmp_dir);
      delete tasks.coffee;
    }
    else if(tasks.js) {
      //Config js
      files = tasks.js;
      delete tasks.js;
    }
    else {
      log.error(module_path + ' - module must have sources.');
      return false;
    }

    //Write the code
    file.write(path.join(build_path, 'modules/js/', config.name + '.js'),
                compileModule(config.name, files));
  }

  if(tasks.mincss) {
    file.write(path.join(build_path, 'modules/css/', config.name + '.css'),
                task.helper('mincss', tasks.mincss));
  }
  if(tasks.hogan) {
    file.write(path.join(build_path, 'modules/templates/', config.name + '.hogan'),
                task.helper('hogan', tasks.hogan));
  }



  console.dir(config.tasks);



  //Clean up
  task.helper('clean', tmp_dir);

  return true;
});



/*
 * Module compilation helper functions
 */

/*
 * Generate the name of the modules to add to window.modules
 */
function slugName(name) {
  return name.replace(/ /ig, '_').toLowerCase();
}


/*
 * Expands and value that is a string (assumed to be a directory)
 * in the config.tasks object.
 */
function expandTasks(module_path, tasks) {

  Object.keys(tasks).forEach(function(key) {
    if(typeof(tasks[key]) === 'string') {
      tasks[key] = fs.readdirSync(path.join(module_path, tasks[key]))
      .filter(function(node) {
        return fs.statSync(path.join(module_path, tasks[key], node)).isFile();
      })
      .map(function(file) {
        return path.join(module_path, tasks[key], file);
      });
    }
  });

  return tasks;
}


/*
 * Forms a proper module from the sources
 */
function compileModule(name, file_paths) {
  var js,
      module = 'window.modules = window.modules || {};\n\n';

  js = file_paths.map(function(file_path) {
    var contents = 'window.modules.' + name + ' = ';
    contents += file.read(file_path);

    return contents;
  }).join('\n').replace(/\n$/g, '');

  module += js;

  return module;
}