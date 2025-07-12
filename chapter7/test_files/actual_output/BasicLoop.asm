// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop LCL 0
@SP
M=M-1
@LCL
D=M
@0
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// label LOOP
(LOOP)
// push argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// push local 0
@0
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// add
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D+M
@SP
M=M+1
// pop LCL 0
@SP
M=M-1
@LCL
D=M
@0
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// push argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// push constant 1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
// sub
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=M-D
@SP
M=M+1
// pop ARG 0
@SP
M=M-1
@ARG
D=M
@0
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// push argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// go-to-if LOOP
@SP
M=M-1
A=M
D=M
@LOOP
D;JNE
// push local 0
@0
D=A
@LCL
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// Infinite loop
(END)
@END
0;JMP
