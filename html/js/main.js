// Global variables

var allData = [];

var selectedBook, mainData, linkData, mainChart, linkChart, scrollPoint; 

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
// update if new data is selected

loadData();



function loadData() {

	d3.json("data/sh-textless.json", function(error, jsonData) {

		if (!error) {
			allData = jsonData;

			createVis();

		}
	})
}

function createVis() {

	console.log("Making the vizzes.");

	mainChart = new textChart("main-viz", allData);
	// TODO: link viz

}

window.addEventListener("resize", function() {
		
		// On resizing, resize main viz
		// d3.select("#main-viz").selectAll("svg").remove();
		mainChart.updateVis();

		// ...and linked viz

	}, false);




