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
					flatStories.push(story);  
				})
			})

			// Getting rid of an outlier... :/ 
			var storyOutlier = d3.max(flatStories, function(d) { return d.wordcount; });

			cleanStories = flatStories.filter(function(story) {
				if (story.wordcount != storyOutlier) {
					return story;
				}
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

window.addEventListener("resize", function() {
		// On resizing, resize main viz
		// d3.select("#main-viz").selectAll("svg").remove();
		mainChart.updateVis();
		// ...and scatterplot and line chart

	}, false);




