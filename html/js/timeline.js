
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
  this.data = _data;

  this.cleanData();
}

timeline.prototype.cleanData = function() {

  var vis = this;

  vis.flatStories = [];

  // Flatten the JSON into an array of stories
  vis.data.forEach(function(year) {
    year.storiesClean.forEach(function(story) {
      vis.flatStories.push(story);
    })
  })

  // Getting rid of an outlier... :/ 
  vis.storyOutlier = d3.max(vis.flatStories, function(d) { return d.wordcount; });

  vis.cleanStories = vis.flatStories.filter(function(story) {
    if (story.wordcount != vis.storyOutlier) {
      return story;
    }
  })
  
  vis.initVis();

}


timeline.prototype.initVis = function(){
  var vis = this; 


  // Draw the canvas
  vis.margin = {top: 10, right: 80, bottom: 10, left: 60 };

  vis.divWidth = $("#" + vis.parentElement).width();

  vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
  vis.height = 225 - vis.margin.top - vis.margin.bottom;

  vis.r = 1.5;

  // vis.minYear = d3.extent(vis.data, function(d) { return d.year; })[0] - 0.5;
  vis.minYear = new Date('3/1/2000')

  // vis.maxYear = d3.extent(vis.data, function(d) { return d.year; })[1] + 0.5;
  vis.maxYear = new Date('10/1/2016');

  // Scales and axes
  vis.x = d3.time.scale()
      .range([0, vis.width])
      .domain([vis.minYear, vis.maxYear]);

  vis.y = d3.scale.linear()
  		.range([vis.height, 0])
      .domain([0, 1]);

  vis.yAxis = d3.svg.axis()
      .scale(vis.y)
      .orient("left")
      .ticks(2)
      .tickFormat(d3.format("%"));

  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


  // Draw line chart
  vis.line = d3.svg.line()
    .interpolate("bundle")
    .x(function(d) { return vis.x(d.date); })
    .y(function(d) { return vis.y(d.vocab_demeaned); });

  vis.avgLines = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return vis.x(d.year)});
    // .y(function(d) { return vis.y(d.)})
  
  vis.linePath = vis.svg.append("g");
  
  vis.linePath.append("path")
    .attr("class", "line")
    .attr("d", vis.line(vis.cleanStories));

  vis.refLines = vis.svg.append("g");

  // Axis
  vis.svg.append("g")
    .attr("class", "y-axis axis")
    .call(vis.yAxis);

    // Brushing component
    vis.brush = d3.svg.brush()
        .x(vis.x)
        .on("brush", brushed);

    vis.svg.append("g")
         .attr("class", "x brush")
         .call(vis.brush)
       .selectAll("rect")
         .attr("y", -6)
         .attr("height", vis.height + 7);

    // Line legend
    vis.cleanStoriesLength = vis.cleanStories.length;
    vis.finalY = vis.y(vis.cleanStories[vis.cleanStoriesLength - 1].vocab_demeaned);

    vis.linePath.append("text")
      .attr("class", "extratiny")
      .attr("x", vis.width - 12)
      .attr("y", vis.finalY)
      .text("% of unique words per story");
      

}

