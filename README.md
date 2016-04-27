CS171 Project: The shape of text
=======

### Summary

Spring 2016. This project will visualize the story shapes of a ~~variety of 19th century novels~~ about ~~300~~ 800+ science fiction short stories. Ideally, I'd like to build something that's extendable to a wide variety of texts. This is the final project for [CS171 Spring 2016](http://www.cs171.org/2016/). 

### Lit review
* [Corpus linguistics](https://en.wikipedia.org/wiki/Corpus_linguistics)
* [Hapax legomenon](https://en.wikipedia.org/wiki/Hapax_legomenon)
* [Summarization](http://www.fastforwardlabs.com/luhn/)


### Inspiration
* [Kurt Vonnegut's lecture: The shape of stories](https://www.youtube.com/watch?v=oP3c1h8v2ZQ)
* [Kurt Vonnegut's actual story shapes](http://visual.ly/kurt-vonnegut-shapes-stories-0)
* [indico: Exploring the shapes of stories using Python and sentiment APIs](https://indico.io/blog/plotlines/)
* [OpenVisConf 2015 video visualization](https://openvisconf.com/2015/#videos)
* [Ben Fry's _Origin of Species_](https://fathom.info/traces/)
* Popular Science archive explorer
* Everything in the [Bocoup text viz exploration slides](https://bocoup-education.github.io/text-vis-ovc/24-text-vis-examples/slides.htmls)

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
* [Jim Vallandingham - Scroller.js](http://vallandingham.me/scroller.html)
* [StackOverflow - Fisheye distortion on simple scatterplot](https://stackoverflow.com/questions/23407421/d3-fisheye-distortion-on-simple-scatter-plot)
* [bl.ocks - Zoomable plot](http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e)
* [Automated Readability Index (ARI)](https://en.wikipedia.org/wiki/Automated_readability_index)
* [Smoothing out lines in d3.js](http://www.d3noob.org/2013/01/smoothing-out-lines-in-d3js.html)


### TODO

###### General
* ~~Get `git` set up.~~
* Keep taking pictures/screenshots for Process Book.
* ~~Find CC-licensed book covers.~~
* ~~New design idea: User can search for something in the text.~~
* ~~New design idea: Tooltip _not_ on hover - but rather, once top word or user word appears, reveal that line to the right of the charts.~~
* ~~New design idea: The long scroll is boring:~~
      * ~~Collapse paras into chapter objects? (Using average sentence length per para?)~~
* ~~`font-awesome`?~~
* **Process book**: Screencast.


###### Data processing
* ~~Select texts for download.~~
* ~~Basic input of `txt`, output `json`.~~
* ~~Top-level object for each text, capturing title, author, top words, etc.~~
* ~~Paragraph-level objects capturing para text, length (sentences vs. characters?), sentences, whether they have any top words in there.~~
* ~~Convert all `len(x)` into word tokenizers counting words, instead of characters.~~
* ~~Fix above -- specifically, fix `cleanWordTokenize()`.~~ 
* ~~**Design 2 (SH scrape)**: Fix 2003 story.~~
* ~~Re-run to get `word-count` objects in year object.~~
* ~~General questions:~~
    1. ~~Should I separate out each book into its own json? What would be most efficient to pull from the server?~~
    2. ~~How else can I reduce the size of the json?~~
* ~~I need full date-time objects for each story for the line chart.~~
* ~~Make unique identifier for all stories.~~ Used index - but why is it 100+ stories over?! (2003 duplicates?)
* ~~Sentence length variance.~~ Did `mean`, `std`.  
* ~~Add story `award` (`1/0`) based on [this](http://www.strangehorizons.com/Awards.shtml).~~

###### Data visualization
* ~~Add templates from best HWs and Labs.~~
* ~~Set up some basic CSS and website structure.~~
* ~~Where to put `#main-viz` and `#link-viz`?~~
* ~~Data summary box - get that started.~~
* Top words ~~buttons~~ word cloud. 
* ~~Get `main.js`, `textChart.js` and `linkChart.js` set up.~~
* ~~User choice covers: CSS, functions.~~ 
* ~~How to replicate Sublime Text's brushed sidebar?~~
    * ~~How to determine height of what the viewer is seeing? Highest data point and lowest data point?~~
* ~~Filter linkData, based on book selected. (Essentially, just remove all `sentences` objects from `text`.)~~
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
* ~~`mouseout` function.~~
* ~~Highlighting is not working on 2003 column (`textChart.js`). 2003 is repeating.~~ 
* ~~Fix ordering of years in `textChart.js`.~~
* ~~What's a better color scheme?~~
* ~~Bookmark interesting stories (from the popup).~~ 
* **Tooltip**: Random image, `"science fiction " + d.top_word[0]` Google CC-license image search!?
* ~~Brushing in `scatterplot.js`: keep scale the same, just filter data points.~~
* ~~`scatterplot.js`: `.data(displayData, function(d) { return d.id; })`... points by index.~~
* ~~`scatterplot.js`: Let the user select the scale (zoom).~~
* User selects y-axis of scatterplot (update `y-label` in `index.html`). 
* ~~Beef up `tooltip`.~~
* Custom refresh for each viz.
* ~~Show bookmarked stories on "See bookmarks" click.~~
* ~~Get year-week for y-axis on `textChart.js`.~~ 
* ~~De-mean the standard deviation.~~
* ~~Excellent option for analysis: [readability.py](https://github.com/mmautner/readability)!~~
* Use [genderize.io](https://genderize.io/) - $9/mo. for 100k names
* ~~Clean up puncts in `wordcount` and `vocab` (you can use a list comprehension: `[w for w in words if w not in r'[\.\?!]']`)~~
* `tf-idf`: how much does a word occur in a story, divided by the number of stories with that word.


###### Prototype v1.0 --> v2.0 (Reviewer comments)
* ~~less text up top and just get to the viz~~
* ~~have it take up the whole screen rather than two columns of 3 different views (like each view one after the other for now)~~
* include some visual keys about what the size means of each dot as well as what the colors mean
* include trends across texts? Like what words are top throughout? What words are trending over time?
* What do you mean by unique word anyhow? 
* ~~have a rollover on each dot of just the most popular unique word and then the other info comes when you click it?~~
* when you say a word is unique, do you mean it is unique to that story? Or is is that the word is occurring once in that particular story?  That is, the classic interpretation of Oelke & Keim's hapax legomena?
* It could be interesting to also see the words that are unique ​_in the corpus_​ to each story.
* It seems like there are yellow lines in the background of the vocab over time - they are very faint, not sure what they are for. 
* ~~Though, for some reason, it took me a minute to realize I could click the title in the popup. It looks a bit like a title.~~
* Finally, have you considered authorship analysis? Do many authors write multiple stories? Are their stories similar or different from each other?
* What about a comparison to some canonical speculative fiction novels as a reference point?
* put it back, but align (CRAP)
* meaningful story in the title; ask a question in the title (subtitle is more technical)
* User-adjustable opacity on `scatterplot.js`?
* ~~What do you think of adjusting the opacity in the scatter?~~
* ~~Bin scatter plot?~~
* ~~Is there any useful category that you can use to color the points in the scatter?~~
* ~~Have you thought about animating the scatterplot transitions?~~ 
* ~~Link to Github doesn't work.~~
* Tooltip word cloud, similar to dem/rep wordle (see [Bocoup slides](https://bocoup-education.github.io/text-vis-ovc/24-text-vis-examples/slides.html#5)).
* Reveal on interaction? (see [Bocoup Stereotropes](http://stereotropes.bocoup.com/))
* Reduce data points shown (gray circles with null fill, excepting award winners, similar to [this](https://bocoup-education.github.io/text-vis-ovc/24-text-vis-examples/slides.html#21)).
* ~~Remove bookmarks functionality. What is bookmarking for? hidden functionality!~~
* Add author filter functionality.
* ~~Remove scatterplot.~~
* Add sentence length variance as user option to timeline.
* ~~Top words tooltip: Filter "said"/"say" and names.~~
* Gender of protagonist?
* Change size encoding to something with better variance: Readability? Sentence variance? 
* More obvious/labelled functionality.
* Bring it all up into one frame!
* ~~Remove "says"/"said" as `stopword`.~~
* POS tag `top_words`, find proper nouns and remove? Or tag/highlight?
* ~~REVERT BACK TO `0f35193` FOR `.js` FILES!~~
* Data summary/table in each tooltip.
* Add award blocks.
* All `timeline.js` circles are `hidden`, until found in one of the search functions. 


