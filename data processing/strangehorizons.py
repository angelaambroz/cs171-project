# !/usr/local/bin/python 

import itertools
import urllib2
import pprint
import numpy
import nltk
import math
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
GENDER = "https://api.genderize.io/?name="

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
			u"'ll",
			u"said", 
			u"says" 
			]
STOP.extend(MORESTOP)
CLEAN = ["CDATA", "comments found", "following HTML tags"]
SPACE = " "

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
	words = [w.lower() for w in words if w not in MORESTOP and w not in r'[\.\?!]']
	return words

def overallTokenizing(rawFile):
	print "Word tokenizing entire text to get top words..."	
	words = cleanWordTokenize(rawFile)
	vocab = sorted(set(words))
	fdist = nltk.FreqDist(words)
	top_words = [(x, y) for (x, y) in fdist.most_common(50) if x not in STOP]
	
	print "Finished tokenizing."
	return words, vocab, top_words


def sentenceLengths(rawFile):
	print "Sentence tokenizing..."
	sentences = nltk.sent_tokenize(rawFile)
	sent_lengths = []

	for sentence in sentences:
		length = len(nltk.word_tokenize(sentence))
		sent_lengths.append(length)

	return sent_lengths


def ARI(words, sentences, rawText):
	print "Calculating the Automated Readability Index..."
	try:	
		ari = 4.71*(len(rawText)/len(words)) + 0.5*(len(words)/len(sentences)) - 21.43
		ari = math.ceil(ari)
	except:
		ari = None
		
	return ari


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
	for index, story_url in enumerate(story_links):

		# Skip podcasts, pull everything else
		if "podcast" not in story_url:

			# Pull raw stuff
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

			# Simple NLP
			story_words, story_vocab, story_top = overallTokenizing(story_text)
			story_sents = sentenceLengths(story_text)
			story_sent_mean = numpy.mean(story_sents)
			story_sent_sd = numpy.std(story_sents)
			story_ari = ARI(story_words, story_sents, story_text)


			try:
				story_year = unidecode(story_soup.find_all(class_="content-date")[0].text[-4:])
				story_date = unidecode(story_soup.find_all(class_="content-date")[0].text)
			except: 
				story_year = story_soup.find_all(class_="content-date")

			allObject.append({
					'year': story_year,
					'raw': story_text
				})

			storyObjects.append({
				'id': index,
				'title': story_title,
				'author': story_author,
				'wordcount': len(story_words),
				'vocab': len(story_vocab),
				'year': story_year,
				'date': story_date,
				'mean_sentence_length': str(story_sent_mean),
				'stdv_sentence_length': str(story_sent_sd),
				# 'raw': story_text,
				'readability': story_ari,
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


with open(DIR + "/processed/sh-data6-no-text.json", "w") as f:
	json.dump(years, f)



