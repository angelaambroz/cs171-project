
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

wordCloud = function(_parentElement, _data) {
	this.parentElement = _parentElement;
  this.data = _data;

  this.initVis();
}


wordCloud.prototype.initVis = function() {
  var vis = this;

  // Draw the word cloud canvas
  vis.divWidth = $("#" + vis.parentElement).width();
  vis.height = vis.divWidth * 6;
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.divWidth)
    .attr("height", vis.height);

  // Scales
  vis.font = d3.scale.log()
      .range([1, 40]);
      
  vis.cleanData();

}

wordCloud.prototype.cleanData = function() {
  var vis = this;

  vis.raw = []

  vis.data.forEach(function(year) {
    year['storiesClean'].forEach(function(story) {
      story['top_within'].forEach(function(word) {
        vis.raw.push(word);
        })
      })
    })

  vis.processing = d3.nest()
    .key(function(d) { return d.word; })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) { return d.count; })})
    .entries(vis.raw);

  // Just the top top...
  vis.words = vis.processing.filter(function(word) {
    if (word.values >= 150 && word.key != "(" && word.key != ")") {
      return word;
    }
  })

  vis.updateVis();

}



wordCloud.prototype.updateVis = function() {

    var vis = this;

    vis.font.domain(d3.extent(vis.words, function(d) { return d.values; }));

    vis.allTexts = vis.svg.selectAll("text")
      .data(vis.words)
      .enter()
      .append("text");

  vis.allTexts
    .attr("x", function() { 
      return Math.floor(Math.random() * vis.divWidth) + "px";
    })
    .attr("y", function() {
      return Math.floor(Math.random() * vis.height) + "px";
    })
    .attr("fill", "gray")
    .attr("font-size", function(d) { return vis.font(d.values) + "px"; })
    .text(function(d) { return d.key; });


}