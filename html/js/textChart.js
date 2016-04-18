

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

	vis.margin = { top: 60, right: 50, bottom: 50, left: 30 };

	vis.divWidth = $("#" + vis.parentElement).width();

	vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
	vis.height = vis.divWidth * 1.1 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	    .attr("id", "textchart-svg")
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales
	vis.color = d3.scale.linear()
		.range(["#ffeda0",
				"#feb24c",
				"#f03b20"]);

	// Scales and axes
	vis.x = d3.time.scale()
	  .range([0, vis.width])
	  .domain(d3.extent(vis.data, function(d) { return d.year; }));

	vis.y = d3.scale.linear()
	  .range([vis.height, 0])
	  .domain([52, 0]);

	vis.radius = d3.scale.sqrt()
				.domain([0, 10000]) //TODO: function of total word count over all stories
				.range([0, 5]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("top")
		.ticks(5);

	vis.svg.append("g").attr("class", "x-axis axis")
		.call(vis.xAxis);

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left")
		.ticks(12);

	vis.svg.append("g")
		.attr("class", "y-axis axis")
		.call(vis.yAxis);

	// legend: draw a rect = story, which transitions colors over time

	// TODO: Update data summary

	// Draw viz
	vis.updateVis();

}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.rectWidth = vis.width / vis.data.length;
	vis.rectHeight = vis.rectWidth / 4;

	vis.maxVocab = 0;
	vis.minVocab = 0;
	vis.maxDate = new Date('4/16/2016');
	vis.minDate = new Date('9/1/2000');

	vis.data.forEach(function(year) {
		year.storiesClean.forEach(function(story) {
			vis.maxVocab = (story.vocab > vis.maxVocab) ? story.vocab : vis.maxVocab;
			vis.minVocab = (story.vocab <= vis.minVocab) ? story.vocab : vis.minVocab;
		})
	})

	vis.color.domain([vis.minVocab, vis.maxVocab]); //this is using yearly vocab, not storyly

	
	vis.year = vis.svg.selectAll(".year")
		.data(vis.data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "year " + d.year; });
		// .attr("transform", function(d, i) { return "translate(" + i*vis.rectWidth + ", 0)"; });

	// New idea: circles!
	vis.circles = vis.year.selectAll("circle")
		.data(function(d) { return d.storiesClean; })
		.enter()
		.append("circle")
		.attr("id", function(d) { return "story" + d.id; })
		.attr("class", "maincircle")
		.attr("cx", function(d) { return vis.x(d.year); })
		.attr("cy", function(d) { return vis.y(d.week); })
		.attr("r", function(d) { return vis.radius(d.wordcount); })
		.attr("fill", function(d) { return vis.color(d.vocab); })
		.on("mouseover", mouseover)
		.on("click", tooltip);


	// vis.year.selectAll("rect")
	// 	.data(function(d) { return d.storiesClean; })
	// 	.enter()
	// 	.append("rect")
	// 	.attr("id", function(d) { return "story" + d.id; })
	// 	.attr("class", "storyrect")
	// 	.attr("width", vis.rectWidth)
	// 	.attr("x", function(d) { return 0; })
	// 	.attr("y", function(d, i) { return vis.rectHeight*i; })
	// 	.attr("height", vis.rectHeight)
	// 	.attr("fill", function(d) { return vis.color(d.vocab)})
	// 	.on("mouseover", mouseover)
	// 	.on("click", tooltip);

}
