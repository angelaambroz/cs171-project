
/*
 * Scatterplot - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

scatterChart = function(_parentElement, _data) {
	this.parentElement = _parentElement;
  this.data = _data;

  this.initVis();
}

scatterChart.prototype.initVis = function() {
  var vis = this;

  vis.brushToggle = true; 
  vis.r = 2;


  // Draw the canvas
  vis.margin = {top: 10, right: 50, bottom: 30, left: 50};

  vis.divWidth = $("#" + vis.parentElement).width();

  vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
  vis.height = 225 - vis.margin.top - vis.margin.bottom;


  // Scales and axes
  vis.x = d3.scale.linear()
      .range([0, vis.width])
      .domain([0, 1]);

  vis.y = d3.scale.linear()
      .range([vis.height, 0]);

  vis.y.domain(d3.extent(vis.data, function(d) { return d.stdv_sentence_length; }));


    // Zoom
  vis.zoomed = d3.behavior.zoom()
    .x(vis.x)
    .y(vis.y)
    .on("zoom", zoom);


  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
    .call(vis.zoomed);

  vis.xAxis = d3.svg.axis()
  	  .scale(vis.x)
  	  .orient("bottom")
      .ticks(3);

  vis.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + vis.height + ")");

  vis.yAxis = d3.svg.axis()
      .scale(vis.y)
      .orient("left")
      .ticks(4);

  vis.svg.append("g")
    .attr("class", "y-axis axis");

  vis.wrangleData();

}


scatterChart.prototype.wrangleData = function() {
  var vis = this;

  if (vis.brushToggle == true) {
    vis.displayData = vis.data;  
  } else {
    vis.displayData = vis.brushData;
  }
  
  vis.updateVis();

}


scatterChart.prototype.updateVis = function() { 

  var vis = this;

  vis.circles = vis.svg.selectAll(".storycircle")
    .data(vis.displayData, function(d) { return d.id; });

  vis.circles.exit().transition().remove();

  vis.circles
    .enter()
    .append("circle")
    .attr("class", "storycircle")
    .attr("r", vis.r)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", tooltip);

  vis.circles
    .transition()  
    .attr("id", function(d) { return "story" + d.id; })
    .attr("cx", function(d) { return vis.x(d.vocab_demeaned); })
    .attr("cy", function(d) { return vis.y(d.stdv_sentence_length); })

  vis.svg.select(".x-axis").call(vis.xAxis);      
  vis.svg.select(".y-axis").call(vis.yAxis);

}
