// Global variables

var allData = [],
	cleanData = [],
	flatStories = [],
	commaFormat = d3.format(',');

var selectedBook, mainData, linkData, mainChart, lineChart, scatter, scrollPoint; 


$(".fa-refresh").on("click", refresh);
$("#showBookmarks").on("click", bookmarks);


// Age of Strange Horizons
function ageOfStrangeHorizons() {
    var now = new Date(),
    	launched = new Date('9/1/2000'),
    	age = now.getTime() - launched.getTime(),
		diffDays = Math.ceil(age / (1000 * 3600 * 24 * 365)),
		diff = age / (1000 * 3600 * 24 * 365); 

	d3.select("#sh-age").transition().text(diff);

    setTimeout(ageOfStrangeHorizons, 3000);
}

ageOfStrangeHorizons();


// load default data
loadData();


function loadData() {

	var formatDate = d3.time.format("%e %B %Y");



	d3.json("data/sh-textless.json", function(error, jsonData) {
		if (!error) {
			allData = jsonData;

			// Get rid of weird stories (to clean in Python later)
			cleanData = allData.filter(function(year) {
				if (year.year != 0) { 
					year.storiesClean = year.stories.filter(function(story) {
						if (story.vocab > 0) {
							return story;
						}
					})

					delete year.stories;
					return year;
				}
			});

			// console.log("hi");
			console.log(allData);

			cleanData.forEach(function(year) {
				year['year'] = +year['year'];
				year['vocab'] = +year['vocab'];
				year['words'] = +year['words'];

				year.storiesClean.forEach(function(story) {
					story['year'] = +story['year'];
					story['vocab'] = +story['vocab'];
					story['words'] = +story['words'];
					story['stdv_sentence_length'] = +story['stdv_sentence_length'];
					story['mean_sentence_length'] = +story['mean_sentence_length'];
					story['date'] = formatDate.parse(story['date']);
					story['vocab_demeaned'] = story['vocab'] / story['wordcount'];
					story['stdv_snt_length_demeaned'] = story['stdv_sentence_length'] / story['mean_sentence_length'];

					if (!story.date) {
						// TODO: Make this not an awful hack!!
						story.date = new Date('9/21/2009');
					}
					
					var thisMonth = story['date'].getMonth() + 1,
						thisDay = parseInt(story['date'].toDateString().slice(8,10)),
						thisWeek = thisMonth * 4 + thisDay / 7;

					story['week'] = thisWeek;

			})
			
			});

			  // Flatten the JSON into an array of stories
			cleanData.forEach(function(year) {
				year.storiesClean.forEach(function(story) {
					if (story.date) {
						flatStories.push(story);  	
					}
				})
			})

			// Getting rid of an outlier... :/ 
			var storyOutlier = d3.max(flatStories, function(d) { return d.wordcount; });

			cleanStories = flatStories.filter(function(story) {
				if (story.wordcount != storyOutlier) {
					return story;
				}
			})

			cleanStories.sort(function(a, b) {
				return b.date - a.date;
			})

			createVis();
		} else {
			console.log(error);
		}

	})
}

function createVis() {
	console.log("Making the vizzes.");
	mainChart = new textChart("main-viz", cleanData);
	scatter = new scatterChart("scatterplot", cleanStories);
	lineChart = new timeline("line-chart", cleanStories);
}

function mouseover(d) {
	// Highlight in red
	d3.selectAll("#story" + d.id).classed("highlighted", true);

	// Tooltip
	var toolWidth = (d.top_within[0].word.length + d.top_within[1].word.length + 2.5)*15 + 100;

	d3.select("#tooltip").remove();

	var tooltip = mainChart.svg.append("g")
		.attr("id", "tooltip")
		.attr("transform", "translate(" + (mainChart.x(d.year) + 15) + ", " + (mainChart.y(d.week) - 5) + ")")

	tooltip
		.append("rect")
		.attr("width",  toolWidth)
		.attr("height", 30)
		.attr("fill", "white")
		.attr("opacity", 0.8);

	tooltip.append("text")	
		.attr("x", 20)
		.attr("y", 20)
		.text("top two words: " + d.top_within[0].word + ", " + d.top_within[1].word);

}

function mouseout(d) {
	d3.selectAll("#story" + d.id).classed("highlighted", false);
	d3.select("#tooltip").remove();
}

function tooltip(d) {

	// console.log(d.date.toDateString());
	var dataPoint = this;
	var title = "<a href='" + d.url + "' target='_blank'>" + d.title + " <i class='fa fa-external-link' aria-hidden='true'></i></a>";

	// TODO: <table>
	var html = "<p>" + d.author + "</p><br>";
		html += "<p>This story has " + commaFormat(d.wordcount) + " words, of which " +  commaFormat(d.vocab) + " are unique.";
		html += " The average sentence is " + Math.round(d.mean_sentence_length) + " words long, with a standard deviation of " + Math.round(d.stdv_sentence_length) + ".</p>";
		html += "<br><p>The top word in this story is <b>" + d.top_within[0].word + "</b> (said " + d.top_within[0].count + " times).</p>";

	swal({
	  title: title,
	  text: html,
	  html: true,
	  animation: false,
	  "allowOutsideClick": true, 
	  showCancelButton: true,
	  confirmButtonColor: "#bac7ff",
	  confirmButtonText: "Bookmark",
	  cancelButtonText: "OK",
	  closeOnConfirm: true,
	  closeOnCancel: true
	},
	function(isConfirm){
		  if (isConfirm) {
		  	d3.selectAll("#story" + d.id).classed("highlighted", false);
		  	d3.selectAll("#story" + d.id).classed("bookmarked", true);
		  } 
		});

}

function brushed() {

	scatter.brushToggle = lineChart.brush.empty();
	scatter.brushData = scatter.data.filter(function(story) {
		if (story.date >= lineChart.brush.extent()[0] && story.date <= lineChart.brush.extent()[1]) {
			return story;
		}
	})

	scatter.wrangleData();

	// TODO: Filter heatmap.d if dates within brush.extent()
	mainChart.circles.classed("grayed", function(d) {
			if (lineChart.brush.empty()) {
				return false;
			} else if (d.date < lineChart.brush.extent()[0] || d.date > lineChart.brush.extent()[1]) {
				return true;
			} else {
				return false;
			}
		});

}

function bookmarks() {
	d3.selectAll(".maincircle").classed("hidden", true);
	d3.selectAll(".storycircle").classed("hidden", true);
	d3.selectAll(".linecircle").classed("hidden", true);
	d3.selectAll(".bookmarked").classed("hidden", false);
}

function refresh() {
	d3.selectAll(".highlighted").classed("highlighted", false);
	d3.selectAll(".grayed").classed("grayed", false);
	d3.selectAll(".bookmarked").classed("bookmarked", false);
	d3.selectAll("circle").classed("hidden", false);
}


function zoom() {
    scatter.svg.select(".x-axis.axis").call(scatter.xAxis);
    scatter.svg.select(".y-axis.axis").call(scatter.yAxis);
    scatter.circles
        .attr("cx", function(d) { return scatter.x(d.stdv_snt_length_demeaned)})
        .attr("cy", function(d) { return scatter.y(d.vocab_demeaned)});
}


// On resizing, resize all three vizzes
window.addEventListener("resize", function() {
		d3.select("#main-viz").selectAll("svg").remove();
		mainChart.initVis();

		d3.select("#scatterplot").selectAll("svg").remove();
		scatter.initVis();

		d3.select("#line-chart").selectAll("svg").remove();
		lineChart.initVis();

	}, false);




