// Global variables

var allData = [];

var selectedBook, mainData, linkData, mainChart, linkChart; 


// load default data
// update if new data is selected

d3.selectAll(".choose").on("click", function() {
	selectedBook = this.childNodes[0].id;
	
	loadData();
});


function loadData() {
	d3.json("data/all-books.json", function(error, jsonData) {

		if (!error) {
			allData = jsonData;

			mainData = allData.filter(function(elem) {
				if (elem.title == selectedBook) {
					return elem;
				}
			});

			console.log(allData);
			console.log(mainData);

			/*
			Pseudo-code:
				1. Users click on a book cover -- DONE
				2. allData is filtered by the book cover's ID (e.g. allData[title]==book[ID]) -- DONE
				3. filtered data is used for main viz -- DONE
				4. allData is then simplified (all text removed, only lengths) for the line chart
			*/

			createVis();

		}
	})
}

function createVis() {

	mainchart = new textChart("main-viz", mainData);
	// TODO: link viz

}

window.addEventListener("resize", function() {
		
		// On resizing, resize main viz
		d3.select("#main-viz").selectAll("svg").remove();
		mainchart.initVis();

		// ...and linked viz

	}, false);

