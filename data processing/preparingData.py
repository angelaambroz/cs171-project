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


def paraTokenizer(rawfile):
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


def overallTokenizing(rawFile):
	print "Word tokenizing entire text to get top words..."
	words = nltk.word_tokenize(rawFile)
	words = [w.lower() for w in words if w not in MORESTOP]
	vocab = sorted(set(words))
	fdist = nltk.FreqDist(words)
	top_words = [(x, y) for (x,y) in fdist.most_common(100) if x not in STOP]
	
	print "Finished tokenizing."
	return words, vocab, top_words


def TitleAuthor(paras):
	# Find title, author
	# I assume title, author etc are in the first 20 paras

	print "Now pulling title and author."

	for x in paragraphs[:20]:
		if "Title" in x:
			title = [w for w in x.split() if w != "Title:"]
			title = ' '.join(title)
		if "Author" in x:
			author = [w for w in x.split() if w != "Author:"]
			author = ' '.join(author)

	return title, author


def buildData(titleText, authorName, allWords, textVocab, topWords, paras):
	print "Now building data..."

	# Overall dict
	textDict = {
		'title': titleText,
		'author': authorName,
		'wordcount': len(allWords),
		'paracount': len(paragraphs),
		'vocab': len(textVocab),
		'top_words': [x for (x, y) in topWords]
	}

	# Make the textList
	textList = []

	for i, para in enumerate(paragraphs):
		# print "Now doing para " + `i`
		words = nltk.word_tokenize(para)
		sentences = nltk.sent_tokenize(para)

		paraDict = {}
		paraDict = {
			'index': i,
			'rawText': para,
			# 'words': [{'word': x, 'length': len(x)} for x in words], #WORDS IS THE BIG STUFF
			'sentences': [{'sent': sentence, 'length': len(sentence)} for sentence in sentences],
			'top': topCheck(top_words, words),
			'length': len(para)
			}

		textList.append(paraDict)
	
	print "The number of paras taken is " + `len(textList)`

	textDict['text'] = textList

	print "Data built."
	return textDict


# Run everything
books = os.listdir(DIR + "/raw")
bigJson = []

for txt in books:
	with io.open(DIR + "/raw/" + txt, 'r', encoding='utf-8') as r:		
		raw = r.read()

	print "\nNow doing: " + txt

	words, vocab, top_words = overallTokenizing(raw)
	paragraphs = paraTokenizer(raw)
	title, author = TitleAuthor(paragraphs)
	bookData = buildData(title, author, words, vocab, top_words, paragraphs)

	bigJson.append(bookData)


# pp.pprint(bigJson)
# print len(bigJson)

with open(DIR + "/processed/data3.json", "w") as f:
	json.dump(bigJson, f)

