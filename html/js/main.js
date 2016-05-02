// Global variables

var allData = [],
	cleanData = [],
	commaFormat = d3.format(',');

var selectedBook, mainData, linkData, mainChart, lineChart; 


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

			createVis();

		} else {

			console.log(error);

		}

	})
}

function createVis() {
	console.log("Making the vizzes.");
	mainChart = new textChart("main-viz", cleanData);
	lineChart = new timeline("line-chart", cleanData);
	wordCloud = new wordCloudConstruct("word-cloud", cleanData);
}




function mouseover(d) {
	d3.selectAll("#story" + d.id).classed("highlighted", true);
}

function mouseout(d) {
	d3.selectAll("#story" + d.id).classed("highlighted", false);
}

function tooltip(d) {

	if (d.award == 1) { 
		var awardIcon = 'Yes <i class="fa fa-trophy" aria-hidden="true"></i>'; 
	} else if (d.year >= 2015) {
		var awardIcon = "No (not yet?)";
	} else {
		var awardIcon = "No";
	}
	
	var html = "<p>" + d.author + "</p><br>";
		html += '<table class="table">';
		html += '<tr>';
		html += '<th>Word count</th>';
		html += '<td>' + commaFormat(d.wordcount) + '</td>';
		html += '</tr><tr>';
		html += '<th>Vocab</th>';
		html += '<td>' +  commaFormat(d.vocab) + '</td>';
		html += '</tr><tr>';
		html += '<th>Most-used word</th>';
		html += '<td><em>' + d.top_within[0].word + '</em></td>';
		html += '</tr><tr>';
		html += '<th>Avg. sentence length</th>';
		html += '<td>' + Math.round(d.mean_sentence_length) + ' words</td>';
		html += '</tr><tr>';
		html += '<th>Award winner?</th>';
		html += '<td>' + awardIcon + '</td>';
		html += '</tr></table>';


	var title = "<a href='" + d.url + "' target='_blank'>" + d.title + " <i class='fa fa-external-link' aria-hidden='true'></i></a>";

	swal({
	  title: title,
	  text: html,
	  html: true,
	  animation: false,
	  "allowOutsideClick": true, 
	  confirmButtonColor: "#bac7ff",
	  confirmButtonText: "OK",
	  closeOnConfirm: true,
	  closeOnCancel: true
	});

}

function brushed() {

	mainChart.circles.classed("grayed", function(d) {
			if (lineChart.brush.empty()) {
				return false;
			} else if (d.date < lineChart.brush.extent()[0] || d.date > lineChart.brush.extent()[1]) {
				return true;
			} else {
				return false;
			}
		});

	var minYear = lineChart.brush.extent()[0].getFullYear();
	var maxYear = lineChart.brush.extent()[1].getFullYear();

	if (lineChart.brush.empty()) {
		wordCloud.filteredData = cleanData;
	} else {
		wordCloud.filteredData = cleanData.filter(function(year) {
			if (year.year >= minYear && year.year <= maxYear) {
				return year;
			}
		})
	}

	wordCloud.wrangleData();
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


// On resizing, resize all three vizzes
window.addEventListener("resize", function() {
		d3.select("#main-viz").selectAll("svg").remove();
		mainChart.initVis();

		d3.select("#line-chart").selectAll("svg").remove();
		lineChart.initVis();

	}, false);




