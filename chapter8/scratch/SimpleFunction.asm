// function SimpleFunction.test 2
(SimpleFunction.SimpleFunction.test)
// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 0
@0
D=A
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
// push local 1
@1
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
// not
@SP
M=M-1
A=M
M=!M
@SP
M=M+1
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
// push argument 1
@1
D=A
@ARG
A=D+M
D=M
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
// return

// frame = LCL
@LCL
D=M
@R13 // frame
M=D

// retAddr = *(frame - 5)
D=D-1
D=D-1
D=D-1
D=D-1
D=D-1
@R14 // retAddr
M=D

// SP = ARG+1
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

@ARG
D=A
@SP
M=D+1

// THAT = *(frame - 1)
@R13
D=M
D=D-1
@THAT
M=D

// THIS = *(frame - 2)
@R13
D=M
D=D-1
D=D-1
@THAT
M=D

// ARG = *(frame - 3)
@R13
D=M
D=D-1
D=D-1
D=D-1
@ARG
M=D

// LCL = *(frame - 4)
@R13
D=M
D=D-1
D=D-1
D=D-1
D=D-1
@LCL
M=D

// goto retAddr
@R14
A=M
0;JMP
// Infinite loop
@END
0;JMP
