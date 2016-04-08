// Global variables

var allData = [];

var selectedBook, mainData, linkData, mainChart, linkChart, scrollPoint; 

// Is the user scrolling?
$w = $(window);

$w.scroll(function() {
	scrollPoint = $w.scrollTop();
});


// load default data
// update if new data is selected

loadData();

// d3.selectAll(".choose").on("click", function() {
// 	selectedBook = this.childNodes[0].id;
	
// 	d3.select("#main-viz").selectAll("svg").remove();
// 	loadData();
// });


function loadData() {

	d3.json("data/sh-textless.json", function(error, jsonData) {

		if (!error) {
			allData = jsonData;

			// mainData = allData.filter(function(elem) {
			// 	if (elem.title == selectedBook) {
			// 		return elem;
			// 	}
			// });

			console.log(allData);

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
		d3.select("#main-viz").selectAll("svg").remove();
		mainChart.initVis();

		// ...and linked viz

	}, false);




