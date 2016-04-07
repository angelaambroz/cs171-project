#!/usr/local/bin/python 

import urllib2
import pprint
import csv
from bs4 import BeautifulSoup
from unidecode import unidecode
import nltk
import os

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

def cleanPara(elem):
	if elem.get('class') == None:
		return False
	if "CDATA" in unidecode(elem.text):
		return False
	# or "No comments found." or "The following HTML tags"


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
	for story_url in story_links:
		story_soup = Souping(top_url + story_url)
		
		# If podcast, skip
		if "Podcast" not in unidecode(story_soup.h1.text):
			story_title = unidecode(story_soup.h1.text)
			story_author = unidecode(story_soup.h2.text)
			story_text = [p.text for p in story_soup.find_all("p") if cleanPara(p)]
			story_year = unidecode(story_soup.find_all(class_="content-date")[0].text[-4:])
			
			print story_text
			for p in story_text:
				print unidecode(p)


#############
#	Demo	#
#############

soup = Souping(SH)
stories = oldStories(soup)
storyContent(TOP, stories[0:5])



