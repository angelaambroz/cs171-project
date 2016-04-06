

/*
 * textChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

textChart = function(_parentElement, _data) {
	this.parentElement = _parentElement;
	this.data = _data;

	this.initVis();

}

textChart.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.divWidth = $("#main-viz").width();
	// console.log(vis.divWidth);

	vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
	vis.height = 2000 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales
	vis.x = d3.scale.linear().range([0, vis.width]);
	vis.y = d3.scale.linear().range([vis.height, 0]);

	// Not making axes.

	// TODO: Update data summary

	// Draw viz
	vis.updateVis();

}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.paraArray = vis.data[0].text;

	// console.log(vis.paraArray);

	vis.maxParaLength = 0;

	vis.paraArray.forEach(function(elem, index) {
		vis.maxParaLength = (elem.length > vis.maxParaLength) ? elem.length : vis.maxParaLength;
	})

	console.log(vis.maxParaLength);

	vis.y.domain([0, vis.paraArray.length]);
	vis.x.domain([vis.maxParaLength, 0]);

	vis.para = vis.svg.selectAll(".para")
		.data(vis.paraArray)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "para-" + d.index; })
		.attr("transform", function(d) { return "translate(0," + vis.y(d.index) + ")"; });

	console.log(vis.paraArray);

	vis.para.selectAll("rect")
		.data(function(d) { return d.sentences; })
		.enter()
		.append("rect")
		.attr("width", function(d) { 
			return vis.x(50);
			// return vis.x(d.length); 
		})
		.attr("x", function(d, i) { 
			console.log("The data is " + d);
			console.log("The index is " + i);
		})
		.attr("height", function(d) { return vis.y(60); })
		.attr("fill", "navy");


	// state.selectAll("rect")
	//   .data(function(d) { return d.ages; })
	// .enter().append("rect")
	//   .attr("width", x.rangeBand())
	//   .attr("y", function(d) { return y(d.y1); })
	//   .attr("height", function(d) { return y(d.y0) - y(d.y1); })
	//   .style("fill", function(d) { return color(d.name); });



}
