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


def tokenizeParas(rawfile):
	print "Now tokenizing into paragraphs..."
	paras = unidecode(raw).splitlines()
	para_index = []

	for i, item in enumerate(paras):
		if item=='':
			para_index.append(i)

	para_index.insert(0, 0)

	new_paras = []

	for i, item in enumerate(para_index):
		string = ' '
		new_string = string.join(paras[para_index[i-1]:para_index[i]])
		new_paras.append(new_string)

	print "Paragraph tokenization complete."
	return new_paras


with io.open(DIR + '/raw/dracula.txt', 'r', encoding='utf-8') as r:
	raw = r.read()
	print unidecode(raw[0:200])
	print type(raw)

	# Paragraph indexes
	paragraphs = tokenizeParas(raw)
	print len(paragraphs)

	textDict = []

	for i, para in enumerate(paragraphs[:10]):
		print "Now doing para " + `i`
		paraObject = {}
		paraObject = {
			'rawText': para,
			'words': nltk.word_tokenize(para),
			'sentences': nltk.sent_tokenize(para),
			'index': i
			}

		textDict.append(paraObject)


pp = pprint.PrettyPrinter(indent=4)
pp.pprint(textDict)
			




	

