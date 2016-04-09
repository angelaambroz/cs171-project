

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
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales
	vis.color = d3.scale.linear()
		.range(["#efedf5",
				"#bcbddc",
				"#756bb1"]);

	// y-axis: stories, x-axis: years

	// TODO: Update data summary

	// Draw viz
	vis.wrangleData();

}

textChart.prototype.wrangleData = function() {
	var vis = this;

	// Get rid of weird stories (to clean later)
	vis.cleaned = vis.data.filter(function(year) {
		if (year.year != 0) {

			console.log("Now cleaning year " + year.year); 
			
			year.storiesClean = year.stories.filter(function(story) {
				if (story.vocab > 0) {
					return story;
				}
			})

			delete year.stories;
			return year;
		}


	});



	console.log(vis.cleaned);


	vis.cleaned.forEach(function(year) {
		year['year'] = +year['year'];
		year['vocab'] = +year['vocab'];
		year['words'] = +year['words'];

		year.storiesClean.forEach(function(story) {
			story['year'] = +story['year'];
			story['vocab'] = +story['vocab'];
			story['words'] = +story['words'];
		})

	});

	vis.updateVis();


}


textChart.prototype.updateVis = function() {
	var vis = this;

	vis.maxVocab = 0,
	vis.minVocab = 400;

	vis.cleaned.forEach(function(year) {
		// console.log("Now doing " + year['year']);

		year.storiesClean.forEach(function(story) {

			vis.maxVocab = (story.vocab > vis.maxVocab) ? story.vocab : vis.maxVocab;
			vis.minVocab = (story.vocab <= vis.minVocab) ? story.vocab : vis.minVocab;

		})
	})


	// vis.x.domain([0, vis.data.length]);
	vis.color.domain([vis.minVocab, vis.maxVocab]); //this is using yearly vocab, not storyly

	vis.year = vis.svg.selectAll(".year")
		.data(vis.cleaned)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "year " + d.year; })
		.attr("transform", function(d, i) { return "translate(" + i*37 + ", 0)"; });

	vis.year.selectAll("rect")
		.data(function(d) { return d.storiesClean; })
		.enter()
		.append("rect")
		.attr("class", "story")
		.attr("width", function(d) { return vis.width / vis.data.length ; })
		.attr("x", function(d) { return 0; })
		.attr("y", function(d, i) { return 20*i; })
		.attr("height", function(d, i) { return 20; })
		.attr("fill", function(d) { return vis.color(d.vocab)})
		.attr("stroke-width", 0.75)
		.attr("stroke", "orange");


}
