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

task.registerHelper('coffee', function(filepath, callback) {

  console.dir(arguments);

  var coffee = require('coffee-script');

  try {
    var js = coffee.compile(file.read(filepath));
    if (js) file.write(filepath.replace(/\.coffee$/, '.js'), js);
  }
  catch (e) {
    log.error(e.message);
  }
});