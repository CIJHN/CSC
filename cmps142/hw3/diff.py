from io import open

import sys

reload(sys)
sys.setdefaultencoding('utf-8')

a = open('./train_file_cmps142_hw3.idmap', 'r')
b = open('./tokenfile', 'r')

text_a = a.read()
text_b = b.read()


toks_a = set(text_a.split('\n'))
toks_b = set(text_b.split('\n'))

print filter(lambda w: w not in toks_a, toks_b)

diff = toks_a - toks_b

print diff
print len(diff)
