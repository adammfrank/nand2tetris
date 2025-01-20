// setup
@256
D=A
@SP
M=D
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
D=M-D
@TRUE_RESULT0
D;JEQ
@FALSE_RESULT0
D;JNE

(FALSE_RESULT0)
@SP
A=M
M=0
@SP
M=M+1
@CONTINUE0
D;JMP

(TRUE_RESULT0)
@SP
A=M
M=-1
@SP
M=M+1
@CONTINUE0
D;JMP

(CONTINUE0)
// Infinite loop
(END)
@END
0;JMP
