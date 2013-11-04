function SVGPathData(content) {
  var that = this, parser;
  this.commands = [];
  parser = new SVGPathData.Parser(function(command) {
    that.commands.push(command);
  });
  parser.parse(content);
  this.encode = function() {  
    var content = '', encoder = new SVGPathData.Encoder(function(chunk) {
      content += chunk;
    });
    encoder.write(this.commands);
    return content;
  }
}

// Commands static vars
SVGPathData.CLOSE_PATH = 1;
SVGPathData.MOVE_TO = 2;
SVGPathData.HORIZ_LINE_TO = 3;
SVGPathData.VERT_LINE_TO = 4;
SVGPathData.LINE_TO = 5;
SVGPathData.CURVE_TO = 6;
SVGPathData.SMOOTH_CURVE_TO = 7;
SVGPathData.QUAD_TO = 8;
SVGPathData.SMOOTH_QUAD_TO = 9;
SVGPathData.ARC = 10;

module.exports = SVGPathData;

// Expose the parser constructor
SVGPathData.Parser = require('./SVGPathDataParser.js');
SVGPathData.Encoder = require('./SVGPathDataEncoder.js');
