/*
 * Adapted from
 * https://gist.github.com/1820595
 */

task.registerBasicTask("coffee", "Compile coffee files to js", function(data, name) {

  var files = file.expand(data);

  files.forEach(function(filepath) {
      task.helper('coffee', filepath);
  });
});

task.registerHelper('coffee', function(filepath) {
  var coffee = require('coffee-script');

  if(filepath.match(/\.coffee$/i)) {
    var compiled,
        dest = filepath.replace(/\.coffee$/, '.js');

    try {
      compiled = coffee.compile(file.read(filepath));
      file.write(dest, compiled);
    }
    catch (e) {
      log.error(e.message);
    }
  }
  else {
    log.error('Attempted to compile non-coffescript file.');
  }
});