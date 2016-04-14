// Global variables

var allData = [],
	cleanData = [],
	flatStories = [];

var selectedBook, mainData, linkData, mainChart, lineChart, scatter, scrollPoint; 

// Is the user scrolling?
$w = $(window);

$w.scroll(function() {
	scrollPoint = $w.scrollTop();
});

$(".fa-refresh").on("click", refresh);


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

			cleanData.forEach(function(year) {
				year['year'] = +year['year'];
				year['vocab'] = +year['vocab'];
				year['words'] = +year['words'];

				year.storiesClean.forEach(function(story) {
					story['year'] = +story['year'];
					story['vocab'] = +story['vocab'];
					story['words'] = +story['words'];
					story['date'] = formatDate.parse(story['date']);

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
		}
	})
}

function createVis() {
	console.log("Making the vizzes.");
	mainChart = new textChart("main-viz", cleanData);
	scatter = new scatterChart("scatterplot", cleanStories);
	lineChart = new timeline("line-chart", cleanStories);
}

function linkHighlight(d) {
	d3.select("#story" + d.id + ".storyrect").classed("highlighted", true);
	d3.selectAll("#story" +  d.id + ".storycircle").classed("highlighted", true);
	d3.selectAll("#story" +  d.id + ".linecircle").classed("highlighted", true);
}

function refresh() {
	d3.selectAll(".highlighted").classed("highlighted", false);
}

function clicked(d) {
	window.open(d.url); 
}

function tooltip(d) {

	var title = "<a href='" + d.url + "' target='_blank'>" + d.title + "</a>";

	var html = "Author: " + d.author + ".";

	swal({
	  title: title,
	  text: html,
	  html: true,
	  type: "info",
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
		  	console.log("#story" + d.id);
		    console.log("Blue button!");
		  } else {
			console.log("Gray button!");
		  }
		});

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




