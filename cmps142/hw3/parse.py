from nltk import word_tokenize, download
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords

from io import open

import sys
import string
import re

global line_n

line_n = 0

reload(sys)
sys.setdefaultencoding('utf-8')

def process(filename):
    src = open(filename, 'r')
    dist = open(filename + '.tok', 'w')
    id_map_dist = open(filename + '.idmap', 'w')
    text = src.read()
    text = text.lower() # put all lower case
    lines = filter(lambda l: len(l) > 0, text.split('\n')) # split lines and filter out the last line which is empty

    punc = re.compile('[%s]' % (re.escape(string.punctuation) + re.escape(u'\u2019')))
    words = set(map(lambda w: punc.sub('', w), stopwords.words('english'))) # stopwords without the '
    stemmer = PorterStemmer()

    counts = dict()
    def tokenize(line):
        tokens = word_tokenize(line) # tokenize the line to words

        tokens[1:] = filter(lambda s: s not in words, tokens[1:]) # filter out the stopwords 
        tokens[1:] = map(lambda w: punc.sub('', w), tokens[1:]) # remove punctuations
        tokens[1:] = filter(lambda w: len(w) > 0, tokens[1:]) # remove empty string
        tokens[1:] = map(stemmer.stem, tokens[1:]) # remove the pre/postfix
        for w in tokens[1:]: # record count
            if w in counts:
                counts[w] = counts[w] + 1
            else:
                counts[w] = 1
        return tokens

    def filter_infreq(tokens): # filter out the words with freq < 5
        if len(tokens) == 1: return tokens # if the text body is empty
        return [tokens[0]] + filter(lambda w: counts[w] >= 5, tokens[1:])

    instances = map(tokenize, lines)
    instances = map(filter_infreq, instances)

    id_map = dict()
    current_id = 0

    for tokens in instances:
        if len(tokens) == 1: # if the text body is empty
            continue
        for w in tokens[1:]:
            if w not in id_map:
                id_map[w] = current_id
                id_map_dist.write(unicode(w + '\n'))
                current_id += 1

    for tokens in instances:
        dist.write(unicode(tokens) + '\n')
    # instances = map(lambda tokens: map(lambda w: id_map[w], tokens), instances)

    print len(id_map)


process('./train_file_cmps142_hw3')
