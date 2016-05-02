# !/usr/local/bin/python 

from unidecode import unidecode
from bs4 import BeautifulSoup

import pandas as pd
import readability 
import requests
import urllib2
import pprint
import nltk
import json
import os
import re


#############
#	Globals	#
#############

DIR = os.getcwd()
pp = pprint.PrettyPrinter(indent=4)
GENDER = "https://api.genderize.io/?name="

AWARDS = "http://www.strangehorizons.com/awards/"
RECENT_AWARDS = "http://www.strangehorizons.com/Awards.shtml"
TOP = "http://www.strangehorizons.com"

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


#########################
#	Helper functions	#
#########################

def Souping(url):
	print "Parsing " + url + "."
	response = urllib2.urlopen(url)
	html = response.read()
	soup = BeautifulSoup(html, 'html.parser')
	return soup


def Genderize(name):
	print "Now guessing the gender of " + name
	r = requests.get(GENDER + name)
	
	if r.status_code == 200:
		response = r.json()
		
		if response['gender'] and response['probability']:
			gender = response['gender']
			gender_prob = response['probability']
		else:
			gender = "unknown"
			gender_prob = "unknown"
	else:
		gender = "unknown"
		gender_prob = "unknown"

	return gender, gender_prob


def getAwardList(awards_index):
	print "Getting list of award stories."

	awards = Souping(awards_index)
	award_pages = [link.text for link in awards.find_all("a", href=True) if "awards-" in link["href"]]
	award_pages.append(RECENT_AWARDS)

	all_awards = []
	for page in award_pages:
		if "awards-" in page:
			this_url = awards_index + page
		else:
			this_url = page
		award_soup = Souping(this_url)
		award_fiction = [url["href"] for url in award_soup.find_all("a", href=True)]
		clean_awards = [TOP + url for url in award_fiction if url[0:4] != "http"]

		all_awards.extend(clean_awards)

	only_awards = set(all_awards)

	return only_awards


def AwardWinner(story, award_list):
	if story['url'] in award_list:
		return 1
	else:
		return 0


def deduplicate(dataset):
	cleaned = []

	for year in dataset:
		print "Now cleaning " + str(year['year'])

		if year['year'] and not any(d['year'] == year['year'] for d in cleaned):
			cleaned.append(year)

	return cleaned

def Heinlein():
	brown = nltk.corpus.brown
	heinlein = brown.words(categories='science_fiction')
	words = [w.lower() for w in heinlein if w not in MORESTOP and w not in r'[\.\?!]']
	vocab = sorted(set(words))

	vocab_demeaned = len(vocab) / float(len(words))

	return vocab_demeaned



#########
#  Run	#
#########

with open(DIR + "/processed/sh-data6-no-text.json", "r") as f:
	data = json.load(f)


cleanDataset = deduplicate(data)
awarded = getAwardList(AWARDS)

for year in cleanDataset:
	print "Now checking awards for " + year['year']

	year['heinlein'] = Heinlein()
	year['awards'] = 0
	year['avg_vocab'] = year['vocab'] / float(year['words'])

	for story in year['stories']:
		story['award'] = AwardWinner(story, awarded)

		if story['award'] == 1:
			year['awards'] += 1


with open(DIR + "/processed/sh-data12-no-text.json", "w") as f:
	json.dump(cleanDataset, f)

