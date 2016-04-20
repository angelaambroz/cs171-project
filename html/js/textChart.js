

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

	vis.margin = { top: 60, right: 50, bottom: 50, left: 60 };

	vis.divWidth = $("#" + vis.parentElement).width();

	vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
	vis.height = vis.divWidth * 0.5 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	    .attr("id", "textchart-svg")
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales
	vis.color = d3.scale.quantize()
		.range(["#ffeda0",
				"#feb24c",
				"#f03b20"])
		.domain([0, 1]);

	// Scales and axes
	vis.minYear = d3.extent(vis.data, function(d) { return d.year; })[0] - 1;
	vis.maxYear = d3.extent(vis.data, function(d) { return d.year; })[1] + 1;

	vis.x = d3.scale.linear()
	  .range([0, vis.width])
	  .domain([vis.minYear, vis.maxYear]);

	vis.y = d3.scale.linear()
	  .range([vis.height, 0])
	  .domain([52, 0]);

	vis.radius = d3.scale.sqrt()
				.domain([0, 10000]) //TODO: function of total word count over all stories
				.range([1, 6]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("top")
		.ticks(5)
		.tickFormat(function(label) { return label.toString(); });

	vis.svg.append("g").attr("class", "x-axis axis")
		.call(vis.xAxis);

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left");

	vis.svg.append("g")
		.attr("class", "y-axis axis")
		.call(vis.yAxis);

	// legend: draw a circle = story, which transitions colors over time
	vis.svg.append("text")
		.attr("class", "tiny")
		.attr("x", -60)
		.attr("y", 30)
		.text("Jan");

	vis.svg.append("text")
		.attr("class", "tiny")
		.attr("x", -60)
		.attr("y", vis.height/2)
		.text("Jun");

	vis.svg.append("text")
		.attr("class", "tiny")
		.attr("x", -60)
		.attr("y", vis.height - 10)
		.text("Dec");


	// TODO: Update data summary

	// Draw viz
	vis.updateVis();

}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.rectWidth = vis.width / vis.data.length;
	vis.rectHeight = vis.rectWidth / 4;
	
	vis.year = vis.svg.selectAll(".year")
		.data(vis.data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "year " + d.year; });

	vis.circles = vis.year.selectAll("circle")
		.data(function(d) { return d.storiesClean; })
		.enter()
		.append("circle")
		.attr("id", function(d) { return "story" + d.id; })
		.attr("class", "maincircle")
		.attr("cx", function(d) { return vis.x(d.year); })
		.attr("cy", function(d) { return vis.y(d.week); })
		.attr("r", function(d) { return vis.radius(d.wordcount); })
		.attr("fill", function(d) { return vis.color(d.vocab_demeaned); })
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.on("click", tooltip);

}
