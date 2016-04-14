

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

	vis.margin = { top: 60, right: 20, bottom: 50, left: 20 };

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

	// y-axis: stories, x-axis: years

	// legend: draw a rect = story, which transitions colors over time

	// TODO: Update data summary

	// Draw viz
	vis.updateVis();

}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.rectWidth = vis.width / vis.data.length;
	vis.rectHeight = vis.rectWidth / 4;

	vis.maxVocab = 0,
	vis.minVocab = 0;

	vis.data.forEach(function(year) {
		year.storiesClean.forEach(function(story) {
			vis.maxVocab = (story.vocab > vis.maxVocab) ? story.vocab : vis.maxVocab;
			vis.minVocab = (story.vocab <= vis.minVocab) ? story.vocab : vis.minVocab;
		})
	})


	// vis.x.domain([0, vis.data.length]);
	vis.color.domain([vis.minVocab, vis.maxVocab]); //this is using yearly vocab, not storyly

	vis.year = vis.svg.selectAll(".year")
		.data(vis.data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "year " + d.year; })
		.attr("transform", function(d, i) { return "translate(" + i*vis.rectWidth + ", 0)"; });

	vis.year.selectAll("rect")
		.data(function(d) { return d.storiesClean; })
		.enter()
		.append("rect")
		.attr("id", function(d) { return "story" + d.id; })
		.attr("class", "storyrect")
		.attr("width", vis.rectWidth)
		.attr("x", function(d) { return 0; })
		.attr("y", function(d, i) { return vis.rectHeight*i; })
		.attr("height", vis.rectHeight)
		.attr("fill", function(d) { return vis.color(d.vocab)})
		.on("mouseover", mouseover)
		.on("click", tooltip);

}
