# !/usr/local/bin/python 

from unidecode import unidecode
import pandas as pd
import readability 
import requests
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


# df = pd.read_json(DIR + "/processed/sh-data5-no-text.json")
# print df


#########################
#	Helper functions	#
#########################

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

def AwardWinner(story):
	print None

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

with open(DIR + "/processed/sh-data7-no-text.json", "w") as f:
	json.dump(cleanDataset, f)

