
/*
 * Scatterplot - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

scatterChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
  this.data = _data;

  this.initVis();
}




scatterChart.prototype.initVis = function(){
  var vis = this; 

  // Draw the canvas
  vis.margin = {top: 50, right: 50, bottom: 30, left: 50};

  vis.divWidth = $("#" + vis.parentElement).width();

  vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
  vis.height = 200 - vis.margin.top - vis.margin.bottom;

  // console.log(vis.data);

  // Scales and axes
  vis.x = d3.scale.linear()
      .range([0, vis.width])
    	.domain(d3.extent(vis.data, function(d) { return d.vocab; }));

  vis.y = d3.scale.linear()
  		.range([vis.height, 0])
      .domain(d3.extent(vis.data, function(d) { return d.wordcount; }));

  vis.xAxis = d3.svg.axis()
  	  .scale(vis.x)
  	  .orient("bottom")
      .ticks(3);

  vis.yAxis = d3.svg.axis()
      .scale(vis.y)
      .orient("left")
      .ticks(4);

  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


  // Draw scatterplot
  vis.r = 1;

  vis.svg.selectAll(".storycircle")
    .data(vis.data)
    .enter()
    .append("circle")
    .attr("class", "storycircle")
    .attr("id", function(d) { return d.title + "-" + d.year; })
    .attr("r", vis.r)
    .attr("cx", function(d) { return vis.x(d.vocab); })
    .attr("cy", function(d) { return vis.y(d.wordcount); });


  vis.svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);

    vis.svg.append("g")
    .attr("class", "y-axis axis")
    .call(vis.yAxis);
    // .attr("transform", "translate(")

}

