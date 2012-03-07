/*
 * Grunt Task File
 * ---------------
 *
 * Task: Stylus
 * Description: Compile stylus .styl files to css
 *
 */

// Dependencies
var stylus = require('stylus');


task.registerBasicTask('stylus', 'Compiles Stylus files to css',
function(data, name) {
  var files = file.expand(data),
      done = this.async();

  task.helper('stylus', files, function(err, css) {
    if(err) done(false);
    file.write(name, css);
    done();
  });

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + name + '" created.');

});

/**
 * A Helper to run Stylus
 */

task.registerHelper('stylus', function(files, cb) {
  var len = files.length,
      src = '';

  for(var i=0; i<len; i++) {
    var type = files[i].split('.').pop(),
        markup = task.directive(files[i], file.read);

    // Don't compile .css files
    if(type === 'css') {
      src += markup + '\n';
      if((i+1) === len) cb(null, src);
    }
    else {
      var style = stylus(markup);

      style.set('include css', true);

      style.render(function(err, css) {
        if(err) {
          log.error(err);
          cb(false);
        }
        // write to disk and call done()
        src += css + '\n';
        if((i+1) === len) cb(null, src);
      });
    }
  }
});
