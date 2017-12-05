#!/afs/cats.ucsc.edu/courses/cmps112-wm/usr/smalltalk/bin/gst -f
"Start Code from example"

nl := Character nl.
FileStream extend [
   nl := Character nl.
   catFile [
      |count|
      count := 0.
      [self atEnd not] whileTrue: [
         count := count + 1
         count asString size to: 5 do: [:skip| stdout << ' '].
         stdout << count << ': ' << self nextLine << nl.
      ]
   ]
]
 
Character extend [
   isPrint [
      ^ (Character space <= self) & (self <= $~)
   ]
   visible [
      self isPrint ifTrue: [^ '$', self asString]
                   ifFalse: [^ self asInteger printStringRadix: 8]
   ]
]

Object subclass: ZeroArray [
   |theArray|

   ZeroArray class >> new [
      self shouldNotImplement.
   ]

   ZeroArray class >> new: size [
      |result|
      result := super new.
      result init: size.
      ^ result
   ]

   init: size [
      theArray := Array new: size.
   ]

   size [
      ^ theArray size.
   ]

   at: index [
      ^ theArray at: index + 1.
   ]

   at: index put: value [
      ^ theArray at: index + 1 put: value.
   ]

   incr: index [
      (self at: index) isNil
         ifTrue: [ self at: index put: 0].
      self at: index put: (self at: index) + 1.
   ]

   keysAndValuesDo: aBlock [
      (0 to: (self size) - 1) do: [:index |
         aBlock value: index value: (self at: index).
      ]
   ]
]

"Leaf subclass modified from tree.st"
Object subclass: Leaf [
   |char count aleaf|
   char [ ^ char ]
   count [ ^ count ]
   aleaf [ ^ aleaf ]
   Leaf class >> new [
      self shouldNotImplement
   ]

   Leaf class >> new: aChar count: aCount [
      |result|
      result := super new.
      result setChar: aChar andCount: aCount.
      ^result
   ]

   setChar: aChar andCount: aCount [
      char := aChar.
      count := aCount.
      aleaf := true. "is a leaf"
   ]

   <= other [
      ^ (count < other count)
      | ((count = other count) & (char <= other char))
   ]

   printBase: aStream [
      ^ aStream << self class << '(' << char << ',' << count
   ]

   printOn: aStream [
      (self printBase: aStream) << ')'.
   ]

   inorder: visitor prefix: string [
      visitor value: char value: string.
   ]

   "need a post-order traversal"
   postorder: visitor [
      visitor value: char value: aleaf.
   ]
]


"-------------classes--------------"
Leaf subclass: Tree [
   |left right|

   Tree class >> new: aChar count: aCount [
      self shouldNotImplement
   ]

   Tree class >> new: aChar count: aCount left: aLeft right: aRight [
      |result|
      result := super new: aChar count: aCount.
      result setLeft: aLeft andRight: aRight.
      ^ result.
   ]

   setLeft: aLeft andRight: aRight [
      left := aLeft.
      right := aRight.
   ]

   printOn: aStream [
      (self printBase: aStream) << ',' << left << ',' << right << ')'.
   ]

   inorder: visitor prefix: string [
      left inorder: visitor prefix: string, '0'.
      right inorder: visitor prefix: string, '1'.
   ]

    postorder: visitor [
      left postorder: visitor. "left first"
      right postorder: visitor. "right next"
      visitor value: char value: aleaf.
   ]

]

Object subclass: OutBits [
   |bitIndex currentByte myStream|
   OutBits class >> new [
      self shouldNotImplement.
   ]
   OutBits class >> new: fileStream [
      |result|
      result := super new.
      result init: fileStream.
      ^result
   ]
   clearByte [
      bitIndex := 8.
      currentByte := 0.
   ]
   init: fileStream [
      myStream := fileStream.
      self clearByte.
   ]
   flushByte [
      bitIndex = 8 ifFalse: [
         myStream nextPutByte: currentByte.
         self clearByte.
      ]
   ]
   writeBit: bit [
      currentByte := currentByte bitAt: bitIndex put: bit.
      bitIndex := bitIndex - 1.
      bitIndex = 0 ifTrue: [self flushByte].
   ]
]

Object subclass: BitStream [
   |bitIndex byte myStream|
   BitStream class >> new: fileStream [
      |result|
      result := super new.
      result init: fileStream.
      ^result
   ]
   init: fileStream [
      myStream := fileStream.
      bitIndex := 1.
   ]
   nextBit [
      bitIndex = 1 ifTrue: [
         byte := myStream next.
         bitIndex := 9.
      ].
      bitIndex := bitIndex - 1.
      ^byte value bitAt: bitIndex
   ]
   atEnd [
      ^bitIndex = 1 and: [myStream atEnd]
   ]
   currByte [
      ^byte
   ]
]

Object subclass: StreamWorker [
    | inStream outStream |
    StreamWorker class >> new: instream out: outstream [
        | result |
        result := super new.
        result init: instream out: outstream.
        ^result.
    ]
    init: in out: o [
        inStream := in.
        outStream := o.
    ]

    work []
    inStream [ ^inStream. ]
    outStream [ ^outStream. ]
]

StreamWorker subclass: CompressorBase [
    | pqueue freqtable encodtable etree |
    
    CompressorBase class >> new: instream out: outstream [
        | result |
        result := super new: instream out: outstream.
        ^result.
    ]

    encodingTable [ ^encodtable. ]
    freqTabele [ ^freqtable. ]
    tree [ ^etree. ]

    init: in out: o [
        | inStream outStream |
        super init: in out: o.

        inStream := self inStream.
        outStream := self outStream.

        pqueue := SortedCollection new.
        freqtable := ZeroArray new: 257.
        encodtable := ZeroArray new: 257.

        freqtable at: 256 put: 1.
       
        [inStream atEnd not] whileTrue: [
            |ordChar|
            ordChar := inStream next asInteger.
            freqtable incr: ordChar.
        ].
        freqtable keysAndValuesDo: [:key :value |
            (value notNil and: [value > 0]) ifTrue: [
                pqueue add: (Leaf new: key count: value).
            ]
        ].
        [pqueue size > 1]
        whileTrue: [
            |lchild rchild tCount tChar newTree| 
            lchild := pqueue removeFirst.
            rchild := pqueue removeFirst.
            tChar := lchild char.
            tCount := (rchild count + lchild count).
            newTree := Tree new: tChar 
                count: tCount left: lchild right: rchild.
            pqueue add: newTree.
        ].
        etree := pqueue removeFirst.
        etree = nil ifFalse: [
            etree inorder: [:char :string |
                encodtable at: char put: string.
            ] prefix: ''.
        ].
    ]
]

CompressorBase subclass: Inspector [
    Inspector class >> new: instream out: outstream [
        | result |
        result := super new: instream out: outstream.
        ^result.
    ]

    work [
        |char number bitstring count temp encodtable freqtable|

        (self outStream ~= stdout) ifTrue: [
            stderr 
            << 'The output filename may not be specified when -t.' 
            << Character nl.
            ObjectMemory quit: 1.
        ].
        encodtable := self encodingTable.
        freqtable := self freqTabele.
        encodtable keysAndValuesDo: [:index :number |
            (number notNil and: [number > 0]) ifTrue: [
                ((index > 32) & (index < 128)) ifTrue: [
                    char := (Character value: index).
                ]
                ifFalse: [
                    index = 256 
                    ifTrue: [char := 'EOF']
                    ifFalse: [
                        char:= (Character value: index) asInteger radix: 16.
                        char := char copyFrom: 4 to: char size.
                        index < 16 ifTrue:[
                            char := ('x0', char).
                        ]
                        ifFalse: [
                            index < 33 ifTrue:[ char := ('x', char). ]
                        ]
                    ]
                ].
                bitstring := encodtable at: index.
                count := 0. 
                stdout << char.
                char asString size to: 5 do: [:skip| stdout << ' '].
                stdout << (freqtable at: index).
                temp := (freqtable at: index). 
                temp asString size to: 4 do: [:skip| stdout << ' '].
                stdout << bitstring << Character nl.
            ].
        ].
    ]
]

CompressorBase subclass: Compressor [
    Compressor class >> new: instream out: outstream [
        | result |
        result := super new: instream out: outstream.
        ^result.
    ]

    work [
        | copybits bitrep outStream etree bitcopy eoftrue bitwise |
        outStream := self outStream.
        etree := self tree.
        " debug_mode ifTrue: [
            (outStream = nil) ifTrue: [
                stdout << 'Writefile is nil. Printing to stdout.' 
                << nl.
            ]
            ifFalse:[
                stdout << 'Printing to ' << outfile << nl.
            ].
            stdout << '-------Compression-------' << nl.
        ]. "

        bitrep := ''.
        etree postorder: [:char :aleaf |
            aleaf ifTrue: [
                | tempbit |
                tempbit := ''.
                char = 0
                ifTrue: [tempbit := '000000000']
                ifFalse: [
                    char = 256
                    ifTrue: [tempbit := '000000001']
                    ifFalse: [
                        8 to: 1 by: -1 do: [:i |
                            tempbit := tempbit, 
                                ((char bitAt: i) printString).
                        ].
                    ].
                ].
                bitrep := (bitrep, '0', tempbit).
            ]
            ifFalse:[ "if not leaf"
                bitrep := (bitrep, '1').
            ].
        ].
        copybits := OutBits new: outStream.
        1 to: (bitrep size) do: [:x |
            bitcopy := ((bitrep at: x) asInteger) - 48.
            copybits writeBit: bitcopy.
        ].
        copybits writeBit: 1.
        [inStream atEnd not] whileTrue: [
            |index code|
            index := inStream next asInteger.
            code := encodtable at: index.
            code do: [:char |
                bitwise := char asInteger - 48.
                copybits writeBit: bitwise.
            ].
        ].
        eoftrue := encodtable at: 256.
        eoftrue do: [:char |
            bitwise := char asInteger - 48.
            copybits writeBit: bitwise.
        ].
        copybits flushByte. 
    ]
]


StreamWorker subclass: Decompressor [
    
    Decompressor class >> new: instream out: outstream [
        | result |
        result := super new: instream out: outstream.
        ^result.
    ]

    work [
        |stack reTree eof bitsInFile bitChar rootnode finished inStream outStream|
        " copybits := OutBits new: writefile. "
    
        inStream := self inStream.
        outStream := self outStream.

        " debug_mode ifTrue: [
            (outStream = nil) ifTrue:[
                stdout << 'outputfile is nil. Printing to stdout' 
                << nl.
            ]
            ifFalse:[
                stdout << 'Printing to ' << fileout << nl.
            ].
            stdout << '------Decompression------' << nl.
        ]. "
        stack := OrderedCollection new.
        bitsInFile := BitStream new: inStream.
        eof := false.
        bitChar := 0.
        reTree := ''.
        rootnode := ''.
        finished := false.
        "rebuild the tree."
        [(bitsInFile atEnd not) & (eof not)] whileTrue: [
            | oneBits |
            bitChar := 0.
            oneBits := bitsInFile nextBit.
            finished ifFalse: [
            " oneBit := bitsInFile nextBit."
            "if the bit is 0, read the next 8 bits"
                oneBits = 0 ifTrue: [
                    | oneBit |
                    8 to: 1 by: -1 do: [:bitindex |
                        oneBit := bitsInFile nextBit.
                        bitChar := bitChar bitAt: bitindex
                            put: oneBit.
                    ].
                    "if value is 0, read one more bit"
                    bitChar = 0 ifTrue: [
                        oneBit := bitsInFile nextBit.
                    "if it is 1, add 256 to bitchar"
                        oneBit = 1 ifTrue: [
                            bitChar := bitChar bitAt: 9 put: 1.
                        ].
                    ].
                    stack add: (Leaf new: bitChar count: 0).
                ].

                "if the bit is 1"
                oneBits = 1 ifTrue: [
                    | right |
                    right := stack removeLast.
                    
                    "if that was the last tree"
                    stack size = 0 ifTrue: [
                        reTree := right.
                        rootnode := reTree.
                        finished := true.
                    ]
                    ifFalse: [
                        | left newTree | 
                        left := stack removeLast.
                        newTree := Tree new: 
                        left char count: 0 left: left right: right.
                        stack add: newTree.
                    ].
                ].
            ]
            ifTrue: [ "if tree has been reconstructed"
            "part e"
                (rootnode aleaf) ifTrue:[
                    "if we've found the leaf eof, end loop"
                    rootnode char = 256 ifTrue: [eof := true]
                    ifFalse: [
                        | echar |
                        echar := Character value: rootnode char.
                        " stdout << 'write char ' << echar << nl  "
                        outStream nextPut: echar.
                        rootnode := reTree.
                    ].
                ] ifFalse: [ "if not a leaf"
                    oneBits = 0 ifTrue: [
                        rootnode := rootnode left.
                        rootnode aleaf ifTrue:[
                            eof not ifTrue:[
                                rootnode char = 256 
                                ifTrue: [eof := true]
                                ifFalse: [
                                    | echar |
                                    echar := Character 
                                        value: rootnode char.
                        " stdout << 'write char ' << echar << nl  "
                                    outStream nextPut: echar.
                                    rootnode := reTree.
                                ].
                            ]
                        ].
                    ] ifFalse: [ "if not 0, check right"
                        rootnode := rootnode right.
                        rootnode aleaf ifTrue:[
                            rootnode char = 256 ifTrue: [eof := true]
                            ifFalse: [
                                | echar |
                                echar := Character 
                                    value: rootnode char.
                        " stdout << 'write char ' << echar << nl  "
                                
                                outStream nextPut: echar.
                                rootnode := reTree.
                            ]
                        ]
                    ].
                ].
            ].
        ].
    ]
]


"*-------------------------------*"
|debug_mode compress_and_print compressing decompressing filein fileout|
" -d Debug information is printed for the benefit of the application
     author. Exact details are not specified.
  -t The compression algorithm is activated, and the decoding
     tree is printed to the standard output. The output
     filename may not be specified.
  -c The input file is compressed and written to the output
     file, if specified, or to the standard output, if not.
  -u The input file is assumed to be compressed, and is
     uncompressed, written to the output file, if specified, or
     to the standard output, if not."
debug_mode := false.
compress_and_print := false.
compressing := false.
decompressing := false.
filein := nil.
fileout := nil.


"parse command"
(Smalltalk arguments size > 1) & (Smalltalk arguments size < 4)
ifFalse: [
    stderr << 'error : Usage : hzip.st -dtcu inputfile [outputfile]' 
        << '. Illegal Length'
        << nl.
    ObjectMemory quit: 1.
].

| mode wokerClass |

mode := Smalltalk arguments at: 1.
filein := Smalltalk arguments at: 2.

(mode ~ '-[dcut]') ifTrue: [
    " argu = '-d' ifTrue: [debug_mode := true]. "
    mode = '-c' ifTrue: [wokerClass := Compressor].
    mode = '-u' ifTrue: [wokerClass := Decompressor].
    mode = '-t' ifTrue: [wokerClass := Inspector].
] ifFalse: [
    stderr << 'error : Usage : hzip.st -dtcu inputfile [outputfile]'
    << nl.
    ObjectMemory quit: 1.
].

" stdout << wokerClass << nl. "

Smalltalk arguments size = 3 ifTrue: [
    fileout := Smalltalk arguments at: 3.
].

filein = nil 
ifTrue: [
    stderr 
    << 'error : Usage : hzip.st -dtcu inputfile [outputfile]'
    << '. Missing input file.'
    << nl.
    ObjectMemory quit: 1.
].

|inStream outStream|
inStream := FileStream open: filein mode: (FileStream read).

fileout = nil
ifTrue: [
    outStream := stdout.
] ifFalse: [
    outStream := FileStream open: fileout mode: (FileStream write).
].

worker := wokerClass new: inStream out: outStream.
worker work.

inStream close.
outStream ~= nil 
ifTrue: [
   outStream close.
].
