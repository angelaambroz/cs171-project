# !/usr/local/bin/python 

from unidecode import unidecode
from bs4 import BeautifulSoup

import pandas as pd
import readability 
import requests
import urllib2
import pprint
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
TOP = "http://www.strangehorizons.com"


# df = pd.read_json(DIR + "/processed/sh-data5-no-text.json")
# print df


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

	awards = Souping(AWARDS)
	award_pages = [link.text for link in awards.find_all("a", href=True) if "awards-" in link["href"]]

	all_awards = []
	for page in award_pages:
		this_url = AWARDS + page
		award_soup = Souping(this_url)
		award_fiction = [TOP + url["href"] for url in award_soup.find_all("a", href=True) if "-f.shtml" in url["href"] and url["href"][0:4] != "http"]
		all_awards.extend(award_fiction)

	only_awards = set(all_awards)

	return only_awards


def AwardWinner(story, award_list):
	print "Did this story win any awards?"

	# check url, loop through all BeautifulSoup
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


#################################
#	Data cleaning functions	#
#################################



#############################
#	Data analysis functions	#
#############################



#########
#  Run	#
#########

with open(DIR + "/processed/sh-data6-no-text.json", "r") as f:
	data = json.load(f)


cleanDataset = deduplicate(data)
awarded = getAwardList(AWARDS)

for year in cleanDataset:
	for story in year['stories']:
		story[u'award'] = AwardWinner(story, awarded)

pp.pprint(cleanDataset)

# with open(DIR + "/processed/sh-data8-no-text.json", "w") as f:
# 	json.dump(cleanDataset, f)

