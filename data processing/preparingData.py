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


def topCheck(topWords, words):
	detupled = [x for (x, y) in topWords]

	for word in detupled:
		if word in words:
			return 1
		else:
			return 0


with io.open(DIR + '/raw/frankenstein.txt', 'r', encoding='utf-8') as r:
	raw = r.read()



print "Word tokenizing entire text to get top words..."
words = nltk.word_tokenize(raw)
words = [w.lower() for w in words if w not in MORESTOP]
vocab = sorted(set(words))
fdist = nltk.FreqDist(words)
top_words = [(x, y) for (x,y) in fdist.most_common(100) if x not in STOP]

print "Finished tokenizing.\n"
# print len(vocab)
print "The top words are:"
print top_words
print "\n"

# Paragraph indexes
paragraphs = tokenizeParas(raw)

# Overall dict
textDict = {
	'title': '',
	'author': '',
	'wordcount': len(words),
	'paracount': len(paragraphs),
	'vocab': len(vocab),
	'top_words': [x for (x, y) in top_words]
}

textList = []

for i, para in enumerate(paragraphs[:200]):
	# print "Now doing para " + `i`
	words = nltk.word_tokenize(para)
	sentences = nltk.sent_tokenize(para)

	paraDict = {}
	paraDict = {
		'index': i,
		'rawText': para,
		'words': [{'word': x, 'length': len(x)} for x in words],
		'sentences': [{'sent': sentence, 'length': len(sentence)} for sentence in sentences],
		'top': topCheck(top_words, words),
		'length': len(para)
		}

	textList.append(paraDict)


# textDict['text'] = textList

pp = pprint.PrettyPrinter(indent=4)
# pp.pprint(textDict)



	

