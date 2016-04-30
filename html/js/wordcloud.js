
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
  vis.margin = {top: 10, right: 0, bottom: 0, left: 0 };
  vis.divWidth = $("#" + vis.parentElement).width();
  vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
  vis.height = (vis.divWidth * 5) - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width)
    .attr("height", vis.height)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales
  vis.font = d3.scale.log()
      .range([4, 40]);

  vis.filteredData = vis.data;
      
  vis.wrangleData();

}

wordCloud.prototype.wrangleData = function() {
  var vis = this;

  vis.moreStopWords = ["(", ")", "would", "could", "should", "like"];

  vis.raw = []

  vis.filteredData.forEach(function(year) {
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

  // Just the top top, removing stopwords again...
  vis.words = vis.processing.filter(function(word) {
    var notStop = $.inArray(word.key, vis.moreStopWords)
    if (word.values >= 100 && notStop == -1) {
      return word;
    }
  })

  vis.updateVis();

}



wordCloud.prototype.updateVis = function() {

    var vis = this;

    vis.font.domain(d3.extent(vis.words, function(d) { return d.values; }));

    vis.allTexts = vis.svg.selectAll("text")
      .data(vis.words);

    vis.allTexts
      .enter()
      .append("text");

  vis.allTexts
    .transition()
    .attr("x", function() { 
      return Math.floor(Math.random() * (vis.width - 75)) + "px";
    })
    .attr("y", function() {
      return Math.floor(Math.random() * vis.height) + "px";
    })
    .attr("fill", "gray")
    .attr("fill-opacity", 0.75)
    .attr("font-size", function(d) { return vis.font(d.values) + "px"; })
    .text(function(d) { return d.key; });

  vis.allTexts.exit().remove();


}

