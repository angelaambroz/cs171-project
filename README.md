CS171 Project: The shape of text
=======

### Summary

Spring 2016. This project will visualize the story shapes of a ~~variety of 19th century novels~~ about ~~300~~ 800+ science fiction short stories. Ideally, I'd like to build something that's extendable to a wide variety of texts. This is the final project for [CS171 Spring 2016](http://www.cs171.org/2016/). 


### Inspiration
* [Kurt Vonnegut's lecture: The shape of stories](https://www.youtube.com/watch?v=oP3c1h8v2ZQ)
* [Kurt Vonnegut's actual story shapes](http://visual.ly/kurt-vonnegut-shapes-stories-0)
* [indico: Exploring the shapes of stories using Python and sentiment APIs](https://indico.io/blog/plotlines/)
* [OpenVisConf 2015 video visualization](https://openvisconf.com/2015/#videos)

### Resources
* [CS171 official website - Project](http://www.cs171.org/2016/project/)
* [CS171 official website - Schedule](http://www.cs171.org/2016/schedule/)
* Book covers:
    * [Frankenstein](https://commons.wikimedia.org/wiki/File:CC_No_26_Frankenstein_2.JPG)
    * [Dracula](https://en.wikipedia.org/wiki/Dracula#/media/File:Dracula1st.jpeg)
    * [Moby Dick](https://en.wikipedia.org/wiki/File:Moby_Dick_p510_illustration.jpg)
    * [Emma](https://en.wikipedia.org/wiki/File:Emma_title_page_1909.jpg)
* [d3 Scalability – Virtual Scrolling for Large Visualizations](http://www.billdwhite.com/wordpress/2014/05/17/d3-scalability-virtual-scrolling-for-large-visualizations/)
* [Tony Hschu - Scroll linked animations](http://blog.tonyhschu.ca/post/49488608263/technical-write-up-scroll-linked-animations)
* [Jim Valladingham - Scroller.js](http://vallandingham.me/scroller.html)
* [StackOverflow - Fisheye distortion on simple scatterplot](https://stackoverflow.com/questions/23407421/d3-fisheye-distortion-on-simple-scatter-plot)
* [bl.ocks - Zoomable plot](http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e)



### TODO

###### General
* ~~Get `git` set up.~~
* Keep taking pictures/screenshots for Process Book.
* ~~Find CC-licensed book covers.~~
* ~~New design idea: User can search for something in the text.~~
* ~~New design idea: Tooltip _not_ on hover - but rather, once top word or user word appears, reveal that line to the right of the charts.~~
* ~~New design idea: The long scroll is boring:~~
      * ~~Collapse paras into chapter objects? (Using average sentence length per para?)~~
* `font-awesome`?


###### Data processing
* ~~Select texts for download.~~
* ~~Basic input of `txt`, output `json`.~~
* ~~Top-level object for each text, capturing title, author, top words, etc.~~
* ~~Paragraph-level objects capturing para text, length (sentences vs. characters?), sentences, whether they have any top words in there.~~
* ~~Convert all `len(x)` into word tokenizers counting words, instead of characters.~~
* ~~Fix above -- specifically, fix `cleanWordTokenize()`.~~ 
* **Design 2 (SH scrape)**: Fix 2003 story.
* ~~Re-run to get `word-count` objects in year object.~~
* ~~General questions:~~
    1. ~~Should I separate out each book into its own json? What would be most efficient to pull from the server?~~
    2. ~~How else can I reduce the size of the json?~~
* ~~I need full date-time objects for each story for the line chart.~~
* ~~Make unique identifier for all stories.~~ Used index - but why is it 100+ stories over?! (2003 duplicates?)
* ~~Sentence length variance.~~ Did `mean`, `std`.  

###### Data visualization
* ~~Add templates from best HWs and Labs.~~
* ~~Set up some basic CSS and website structure.~~
* ~~Where to put `#main-viz` and `#link-viz`?~~
* ~~Data summary box - get that started.~~
* Top words ~~buttons~~ word cloud. 
* Get ~~`main.js`~~, ~~`textChart.js`~~ and `linkChart.js` set up.
* ~~User choice covers: CSS, functions.~~ 
* ~~How to replicate Sublime Text's brushed sidebar?~~
    * ~~How to determine height of what the viewer is seeing? Highest data point and lowest data point?~~
* Filter linkData, based on book selected. (Essentially, just remove all `sentences` objects from `text`.)
* ~~Jane Austen `maxParaLength` seems way too high.~~
* ~~Apply `d3.stack.layout()` data transformation to `paraArray` in `textChart.js`.~~ (Did this manually.)
* ~~Resize isn't re-loading `mainChart` in the correct way.~~
* ~~Figure out `height` on `mainChart`.`~~
* ~~Center `mainChart`.~~
* ~~Heat map of complexity (using `vocab`).~~
* ~~Hyperlink each square.~~
* Smoother transition on `#sh-age`. 
* ~~Tooltip each story: title, author (URL?).~~ 
* Special outline for my story? (vanity button?)
* Why is `words` appearing in the story objects?
* `#scatterplot`: ~~axes, lines~~, labels (use Bootstrap `.code` class).
* `#linechart`: get it started.
* ~~Linking the charts together...! Highlights, brushed.~~
* `mouseout` function.
* Highlighting is not working on 2003 column (`textChart.js`). 2003 is repeating. 
* Fix ordering of years in `textChart.js`. 
* ~~What's a better color scheme?~~
* ~~Bookmark interesting stories (from the popup).~~ 
* **Tooltip**: Random image, `"science fiction " + d.top_word[0]` Google CC-license image search!?
* ~~Brushing in `scatterplot.js`: keep scale the same, just filter data points.~~
* ~~`scatterplot.js`: `.data(displayData, function(d) { return d.id; })`... points by index.~~
* `scatterplot.js`: Let the user select the scale (zoom).
* User selects y-axis of scatterplot (update `y-label` in `index.html`). 
* Beef up `tooltip`. 
* Custom refresh for each viz ()



