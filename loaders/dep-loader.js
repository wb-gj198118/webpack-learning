const path = require('path');
const fs = require('fs');

module.exports = function (source) {
  var callback = this.async();
  var headerPath = path.resolve('loaders/example-loader.js');

  console.log('headerPath',headerPath);

  this.addDependency(headerPath);

  fs.readFile(headerPath, 'utf-8', function (err, header) {
    if (err) return callback(err);
    callback(null, header + '\n' + source);
  });
}