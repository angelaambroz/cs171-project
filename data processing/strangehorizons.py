#!/usr/local/bin/python 

import urllib2
import pprint
import ast
import csv
import nltk
import os
import json
from bs4 import BeautifulSoup
from unidecode import unidecode
from nesting import Nest

#############
#	Globals	#
#############

SH = "http://www.strangehorizons.com/Archive.alt.pl?Dept=f"
TOP = "http://www.strangehorizons.com"
DIR = os.getcwd()
pp = pprint.PrettyPrinter(indent=4)
STOP = nltk.corpus.stopwords.words('english')
MORESTOP = [
			u",",
			u".",
			u"''",
			u";",
			u"--",
			u'``',
			u'!',
			u"'s",
			u"*",
			u":",
			u"?",
			u"'",
			]
STOP.extend(MORESTOP)
CLEAN = ["CDATA", "comments found", "following HTML tags"]
SPACE = " "
pp = pprint.PrettyPrinter(indent=4)


#########################
#	Helper functions	#
#########################

def Souping(url):
	print "Parsing " + url + "."
	response = urllib2.urlopen(url)
	html = response.read()
	soup = BeautifulSoup(html, 'html.parser')
	return soup

def cleanWordTokenize(rawWords):
	words = nltk.word_tokenize(rawWords)
	words = [w.lower() for w in words if w not in MORESTOP]
	return words

def overallTokenizing(rawFile):
	print "Word tokenizing entire text to get top words..."	
	words = cleanWordTokenize(rawFile)
	vocab = sorted(set(words))
	fdist = nltk.FreqDist(words)
	top_words = [(x, y) for (x, y) in fdist.most_common(100) if x not in STOP]
	
	print "Finished tokenizing."
	return words, vocab, top_words


#################################
#	Data collection functions	#
#################################

def oldStories(souped):
	print "Grabbing previous issues."
	old_stories = []

	for link in souped.find_all('a', href=True):
		if "/20" in link["href"]:
			old_stories.append(link["href"])	

	return old_stories


def storyContent(top_url, story_links):

	# Saving all text to run top_words on it
	yearObjects = []
	storyObjects = []

	# Pulling text from all stories
	print "Pulling text from stories..."
	for story_url in story_links:
		story_soup = Souping(top_url + story_url)

		# If podcast, skip
		if "Podcast" not in unidecode(story_soup.h1.text):
			story_title = unidecode(story_soup.h1.text)
			story_author = unidecode(story_soup.h2.text)
			story_text = [p.text for p in story_soup.find_all("p") 
							if p.get("class") == None 
							and "CDATA" not in unidecode(p.text)
							and "comments found" not in unidecode(p.text)
							and "following HTML tags" not in unidecode(p.text)
							and "Archived Fiction Dating" not in unidecode(p.text)]
			story_text = SPACE.join(story_text)
			story_year = unidecode(story_soup.find_all(class_="content-date")[0].text[-4:])
			num_words = len(cleanWordTokenize(story_text))

			yearObjects.append({
					'year': story_year,
					'raw': story_text
				})

			# storyObjects.append({
			# 	'title': story_title,
			# 	'author': story_author,
			# 	'wordcount': num_words,
			# 	'year': story_year,
			# 	'raw': story_text
			# 	})



			# allText.append(story_text)

	return yearObjects, storyObjects




#############
#	Demo	#
#############

soup = Souping(SH)
stories = oldStories(soup)
years, stobjects = storyContent(TOP, stories[0:5])

test = (Nest()
		.key('year')
		.entries(years))

print type(years)
print type(test)
print type(test[0])
print dir(test[0])
# print test[0].key
# print test[0].values

# print type(ast.literal_eval(test[0]))
# pp.pprint(test)




