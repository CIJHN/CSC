from nltk import word_tokenize, download
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords

from io import open

import sys
import string
import re
import time

reload(sys)
sys.setdefaultencoding('utf-8')

def write_csv(file, headers, vectors):
    file.write(','.join(headers) + '\n')
    for vec in vectors:
        file.write(','.join(map(lambda v: unicode(v), vec)) + '\n')

def process(train_file, test_file):
    src = open(train_file, 'r')
    test_src = open(test_file, 'r')
    dist = open('HW3_Xu_train.csv', 'w')
    test_dist = open('HW3_Xu_test.csv', 'w')
    tok_dist = open(train_file + '.tok', 'w')
    id_map_dist = open(train_file + '.idmap', 'w')
    text = src.read().lower() # put all lower case
    test_text = test_src.read().lower() # put test lower
    
    test_lines = filter(lambda l: len(l) > 0, test_text.split('\n'))
    lines = filter(lambda l: len(l) > 0, text.split('\n')) # split lines and filter out the last line which is empty

    punc = re.compile('[%s]' % (re.escape(string.punctuation)))
    words = set(stopwords.words('english'))
    # words = set(map(lambda w: punc.sub('', w), stopwords.words('english'))) # stopwords without the '
    stemmer = PorterStemmer()

    counts = dict() # total count map
    raw_tokens = set() # raw tokens after first tokenize
    vec_len = 0 # vector length
    id_map = dict() # word to word id map
    current_id = 0 # current word id

    def tokenize(line):
        tokens = word_tokenize(line) # tokenize the line to words

        for i in tokens:
            raw_tokens.add(i) # record the raw tokens
            
        tokens[1:] = filter(lambda s: s not in words, tokens[1:]) # filter out the stopwords 
        tokens[1:] = map(lambda w: punc.sub('', w), tokens[1:]) # remove punctuations
        tokens[1:] = filter(lambda w: len(w) > 0, tokens[1:]) # remove empty string
        tokens[1:] = map(stemmer.stem, tokens[1:]) # remove the pre/postfix
        
        return tokens

    def build_vec(tokens): # build vector
        vec = [0] * (vec_len + 1)
        counts = dict() 
        for w in tokens[1:]: # count 
            counts[w] = counts[w] + 1 if w in counts else 1
        for w in tokens[1:]: # assign
            if w in id_map:
                vec[id_map[w]] = counts[w]
        vec[-1] = tokens[0] # assign label
        return vec

    # tokenize all lines
    instances = map(tokenize, lines)

    # count the word in training set
    for tokens in instances:
        for w in tokens[1:]: # record count
                counts[w] = counts[w] + 1 if w in counts else 1

    # filter out the word in training set with freq < 5
    instances = map(lambda tokens: tokens if len(tokens) == 1 else [tokens[0]] + filter(lambda w: counts[w] >= 5, tokens[1:]), instances)

    # start build id map from instances
    for tokens in instances:
        if len(tokens) == 1: # if the text body is empty, ignore it
            continue
        for w in tokens[1:]: 
            if w not in id_map: # build the id map
                id_map[w] = current_id
                id_map_dist.write(unicode(w + '\n')) # debug output id map
                current_id += 1

    for tokens in instances: # debug output the tokens
        tok_dist.write(unicode(tokens) + '\n')
    
    # the length of id map is the dimension of the feature vector
    vec_len = len(id_map)
    
    # build header row
    headers = [''] * (vec_len + 1) 
    for w, i in id_map.iteritems():
        headers[i] = w
    headers[-1] = u'label'

    # build to vec
    vecs = map(build_vec, instances)

    # write to the output file
    write_csv(dist, headers, vecs)

    print '# report'
    print '2a. %d' % len(raw_tokens)
    print '5a. %s' % unicode(tokenize(u"ham I've been searching for the right words to thank you for this breather. I promise i wont take your help for granted and will fulfil my promise. You have been wonderful and a blessing at all times.".lower())[1:])
    print '6a. %d' % len(id_map)
    print '7a. %s' % 'HW3_Xu_train.csv'
    print '7b. %s' % (u'yellow' in id_map)
    print '7c. %s' % (u'music' in id_map)
    print '7d. %d' % reduce(lambda a, b: a + b, vecs[0][0 : -1], 0)
    print '7e. %d' % len(filter(lambda vec: reduce(lambda a, b: a + b, vec[0 : -1], 0) == 0, vecs))

    # apply the same process to test lines
    test_instances = map(tokenize, test_lines)
    test_vecs = map(build_vec, test_instances)
    write_csv(test_dist, headers, test_vecs)

    print '# report test'
    print '1a. %s' % test_instances[23][1:]
    print '2a. %s' % 'HW3_Xu_test.csv'
    print '2b. %d' % len(test_vecs)
    print '2c. %d' % len(headers)
    print '2d. first 5 names in train %s, first 5 names in test %s' % (headers[:5], headers[:5])
    print '2e. %s' % (u'head' in headers)
    print '2f. %d' % len(filter(lambda vec: reduce(lambda a, b: a + b, vec[0 : -1], 0) == 0, test_vecs))
    print '2g. If not represent them into the same feature space, we cannot test/check our training result with test space'


start_time = time.time()
process('./train_file_cmps142_hw3', './test_file_cmps142_hw3')
print '--- %s seconds ---' % (time.time() - start_time)

