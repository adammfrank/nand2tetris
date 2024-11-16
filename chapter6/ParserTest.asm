// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.

// Computes R0 = 2 + 3  (R0 refers to RAM[0])

@2
D=A
(FOO_LABEL)
D=D+1;JMP
@3
D=D+A
@0
M=D