#!/usr/local/bin/python 

import itertools
import urllib2
import pprint
import nltk
import json
import csv
import ast
import os

from bs4 import BeautifulSoup
from unidecode import unidecode

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
			u"n't",
			u"'d",
			u"'m",
			u"'ve",
			u"'re",
			u"'ll"
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
	allObject = []
	storyObjects = []

	# Pulling text from all stories
	print "Pulling text from stories..."
	for story_url in story_links:

		# If podcast, skip
		if "podcast" not in story_url:
			story_soup = Souping(top_url + story_url)
			story_title = unidecode(story_soup.h1.text)
			story_author = unidecode(story_soup.h2.text)
			story_text = [p.text for p in story_soup.find_all("p") 
							if p.get("class") == None 
							and "CDATA" not in unidecode(p.text)
							and "comments found" not in unidecode(p.text)
							and "following HTML tags" not in unidecode(p.text)
							and "Archived Fiction Dating" not in unidecode(p.text)]
			story_text = SPACE.join(story_text)
			story_words, story_vocab, story_top = overallTokenizing(story_text)

			try:
				story_year = unidecode(story_soup.find_all(class_="content-date")[0].text[-4:])
				story_date = unidecode(story_soup.find_all(class_="content-date")[0].text)
			except: 
				story_year = story_soup.find_all(class_="content-date")

			# num_words = len(cleanWordTokenize(story_text))

			allObject.append({
					'year': story_year,
					'raw': story_text
				})

			storyObjects.append({
				'title': story_title,
				'author': story_author,
				'wordcount': len(story_words),
				'vocab': len(story_vocab),
				'year': story_year,
				'date': story_date,
				# 'raw': story_text,
				'url': top_url + story_url,
				'top_within': [{'word': x, 'count': y } for (x, y) in story_top]
				})


	return allObject, storyObjects



#########
#  Run	#
#########

soup = Souping(SH)
stories = oldStories(soup)
alltext, storyList = storyContent(TOP, stories)

years = []

for key, group in itertools.groupby(alltext, lambda item: item["year"]):
	yearStories = [item["raw"] for item in group]
	
	yearRaw = SPACE.join(yearStories)
	yearWords, yearVocab, yearTop = overallTokenizing(yearRaw)

	years.append({
		'year': key,
		'words': len(yearWords),
		'num_stories': len(yearStories),
		'vocab': len(yearVocab),
		'top': [{'word': x, 'count': y } for (x, y) in yearTop]
		})

for year in years:
	print "Now doing stories from the year " + `year['year']` + "!"

	year['stories'] = []
	
	for story in storyList:
		if year['year'] == story['year']:
			year['stories'].append(story)


with open(DIR + "/processed/sh-data3-no-text.json", "w") as f:
	json.dump(years, f)



