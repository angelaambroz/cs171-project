#!/usr/local/bin/python

from unidecode import unidecode
import io
import os
import ast
import nltk
import json
import pprint
import random


DIR = os.getcwd()
pp = pprint.PrettyPrinter(indent=4)
dataset = []
UNICODE = nltk.corpus.stopwords.words('english')
STOP = []
MORESTOP = ['.', ',', 'the', '?', '-', '(', ')', ':', 
			'[', ']', '%', ';', '\n', '\\n', '...', '\\n\\n',
			'***\\n', '**\\n', '*\\n']
STOP.extend(MORESTOP)

for word in UNICODE:
	word = word.encode('utf8')
	STOP.append(word)


with io.open(DIR + '/raw/dracula.txt', 'r', encoding='utf-8') as r:
	raw = r.read()
	print unidecode(raw[0:200])
	print type(raw)

	print "Now tokenizing into words and sentences..."
	# sentences[51] is funny
	words = nltk.word_tokenize(raw)
	print "Word tokenization complete."
	sentences = nltk.sent_tokenize(raw)
	print "Sentence tokenization complete."

	# Paragraph indexes
	paras = unidecode(raw).splitlines()
	print type(paras)
	print paras[2000:2050]
	# Actual paras have '' between them, hmm
	

