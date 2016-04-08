

/*
 * textChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

textChart = function(_parentElement, _data) {
	this.parentElement = _parentElement;
	this.data = _data;

	this.color = d3.scale.linear()
		.range(["#feebe2",
			"#fbb4b9",
			"#f768a1",
			"#c51b8a",
			"#7a0177"]);

	this.initVis();

}

textChart.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.divWidth = $("#main-viz").width();
	// console.log(vis.divWidth);

	vis.width = vis.divWidth - vis.margin.left - vis.margin.right,
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales
	vis.x = d3.scale.linear().range([0, vis.width]);
	vis.y = d3.scale.linear().range([vis.height, 0]);

	// y-axis: stories, x-axis: years

	// TODO: Update data summary

	// Draw viz
	vis.updateVis();

}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.maxStories = 0,
	vis.minVocab = 0,
	vis.maxVocab = 0;

	vis.data.forEach(function(year) {

		vis.maxStories = (year.stories.length > vis.maxStories) ? year.stories.length : vis.maxStories;
		vis.maxVocab = (year.stories.vocab > vis.maxVocab) ? year.stories.vocab : vis.maxVocab;
		// vis.minVocab = ();


		// year.sentences.forEach(function(sent, index) {
		// 	sent.x0 = (index == 0) ? 0 : year.sentences[index - 1].length;
		// 	sent.x1 = (index == 0) ? sent.length : year.sentences[index - 1].length + sent.length;
		// })

	})

	// console.log(vis.maxStories);
	// console.log(vis.data.length);

	vis.y.domain([vis.maxStories, 0]);
	vis.x.domain([0, vis.data.length]);
	vis.color.domain(d3.extent(vis.data, function(d) { return d.vocab; })); //this is using yearly vocab, not storyly

	vis.year = vis.svg.selectAll(".year")
		.data(vis.data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "year " + d.year; })
		.attr("transform", function(d, i) { return "translate(" + i*37 + ", 0)"; });

	vis.year.selectAll("rect")
		.data(function(d) { return d.stories; })
		.enter()
		.append("rect")
		.attr("width", function(d) { return vis.width / vis.data.length ; })
		.attr("x", function(d) { return 0; })
		.attr("y", function(d, i) { return 20*i; })
		.attr("height", function(d, i) { return 20; })
		.attr("fill", function(d) { return vis.color(d.vocab)})
		.attr("stroke-width", 0.75)
		.attr("stroke", "orange");


}
