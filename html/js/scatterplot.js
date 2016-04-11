
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

  // I'll need a magnifying glass here...
  vis.fisheye = d3.fisheye.circular()
    .radius(10);

  // Draw the canvas
  vis.margin = {top: 10, right: 50, bottom: 30, left: 50};

  vis.divWidth = $("#" + vis.parentElement).width();

  vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
  vis.height = 225 - vis.margin.top - vis.margin.bottom;

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

  vis.circles = vis.svg.selectAll(".storycircle")
    .data(vis.data)
    .enter()
    .append("circle")
      .datum(function(d) {
        return { x: d.vocab, y: d.wordcount };
      })
    .attr("class", "storycircle")
    .attr("id", function(d) { return d.title + "-" + d.year; })
    .attr("r", vis.r)
    .attr("cx", function(d) { return vis.x(d.x); })
    .attr("cy", function(d) { return vis.y(d.y); })
    .on("mouseover", linkHighlight);

  vis.svg.on("mousemove", function() {
    console.log("hello");
    vis.fisheye.focus(d3.mouse(this));

    vis.circles.each(function(d) { d.fisheye = vis.fisheye(d); })
      .attr("cx", function(d) { return d.fisheye.x; })
      .attr("cy", function(d) { return d.fisheye.y; })
      .attr("r", function(d) { return d.fisheye.z * 2; });
   })


  // .append("circle")
  //   .datum( function(d) {
  //       return {x: d.pages, y: d.books} // change data, to feed to the fisheye plugin
  //   })
  //   .attr("cx", function (d) {return d.x}) // changed data can be used here as well
  //   .attr("cy", function (d) {return d.y}) // ...and here


  vis.svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);

    vis.svg.append("g")
    .attr("class", "y-axis axis")
    .call(vis.yAxis);

}

