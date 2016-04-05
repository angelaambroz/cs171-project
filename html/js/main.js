// Global variables

var allData = [];

var mainchart, minichart; 


// load default data
// update if new data is selected

loadData()

function loadData() {
	d3.json("data/all-books.json", function(error, jsonData) {

		if (!error) {
			allData = jsonData;

			console.log(allData);

			/*
			Pseudo-code:
				1. Users click on a book cover
				2. allData is filtered by the book cover's ID (e.g. allData[title]==book[ID])
				3. filtered data is used for main viz
				4. allData is then simplified (all text removed, only lengths) for the line chart
			*/

			createVis();

		}
	})
}

function createVis() {

	mainchart = new textChart("main-viz", allData);
	// TODO: link viz

}

window.addEventListener("resize", function() {
		
		// On resizing, resize main viz
		d3.select("#main-viz").selectAll("svg").remove();
		mainchart.initVis();

		// ...and linked viz

	}, false);

