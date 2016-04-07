

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
	vis.height = 8000 - vis.margin.top - vis.margin.bottom;

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


	vis.maxParaLength = 0;

	vis.paraArray.forEach(function(elem) {
		vis.maxParaLength = (elem.length > vis.maxParaLength) ? elem.length : vis.maxParaLength;

		elem.sentences.forEach(function(sent, index) {
			sent.x0 = (index == 0) ? 0 : elem.sentences[index - 1].length;
			sent.x1 = (index == 0) ? sent.length : elem.sentences[index - 1].length + sent.length;
		})

	})

	// console.log(vis.paraArray);
	// console.log(vis.maxParaLength);

	vis.y.domain([vis.paraArray.length, 0]);
	vis.x.domain([0, vis.maxParaLength]);

	vis.para = vis.svg.selectAll(".para")
		.data(vis.paraArray)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("id", function(d) { return "para-" + d.index; })
		.attr("transform", function(d) { return "translate(0," + vis.y(d.index) + ")"; });

	vis.para.selectAll("rect")
		.data(function(d) { return d.sentences; })
		.enter()
		.append("rect")
		.attr("width", function(d) { return vis.x(d.length); })
		.attr("x", function(d) { return vis.x(d.x0); })
		.attr("height", function(d, i) { return vis.height /vis.paraArray.length; })
		.attr("fill", function(d) {
			if (d.top == 0 || d.top.search("Emma") == -1) {
				return "gray";	
			} else if (d.top.search("Emma") > -1) {
				console.log(d.top);
				return "yellow";
				// return "#"+Math.floor(Math.random()*16777215).toString(16);
			}
		})
		.attr("stroke-width", 0.75)
		.attr("stroke", "orange");


}
