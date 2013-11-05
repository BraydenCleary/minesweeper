var fs = require('fs')
  , combinedStream = require('combined-stream')

var compile = module.exports = function() {
  var cs = combinedStream.create()
  jsFiles.forEach(function(path) { cs.append(fs.createReadStream(path)) })
  return cs
}

var jsFiles  = [
  'angular.min.js',
  'jquery.min.js',
  'underscore.min.js',
  'minesweeper_module.js',
  'tile.js',
  'tile_controller.js',
  'board_controller.js',
]
