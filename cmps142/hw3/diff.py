#!/usr/bin/python

from io import open

import sys

reload(sys)
sys.setdefaultencoding('utf-8')

a = open('./train_file_cmps142_hw3.idmap', 'r')
b = open('./bigString', 'r')

text_a = a.read()
text_b = b.read()

toks_a = set(text_a.split('\n'))
toks_b = set(text_b.split('\n'))

diff = toks_a - toks_b

print toks_a - toks_b
print toks_b - toks_a
