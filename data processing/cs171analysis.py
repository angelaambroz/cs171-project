# !/usr/local/bin/python 

from unidecode import unidecode
import pandas as pd
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


#################################
#	Data cleaning functions	#
#################################



#############################
#	Data analysis functions	#
#############################


#########
#  Run	#
#########

with open(DIR + "/processed/sh-textless.json", "r") as f:
	data = json.load(f)

for year in data:
	for story in year['stories']: 
		names = story['author'].split()
		if names[1]: 
			first_name = names[1]
			gender, gender_probability = Genderize(first_name)
			story['gender'] = gender
			story['gender_p'] = gender_probability
		else:
			print "No name"

pp.pprint(data)