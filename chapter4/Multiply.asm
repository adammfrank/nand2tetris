// Program: Multiply.asm
// Computes Ram[0] * Ram[1] and stores in Ram[2]
// Usage: put values in RAM[0] and RAM[1]
// total = 0
// i = 0
// LOOP:
//	i = i+1
// 	if(i ==	RAM[1]) goto END
//	total = total + RAM[0]
//	goto LOOP
// END:

@total
M=0 // total = 0
@i
M=0 // i = 0
@R2
M=0

(LOOP)
@i
D=M
@R1
D=M-D
@STOP
D;JEQ

@i
M=M+1


@total
D=M
@R0
D=D+M
@total
M=D
@LOOP
0;JMP

(STOP)
@total
D=M
@R2
M=D

(END)
@end
0;JMP
 
