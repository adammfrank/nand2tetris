// Bootstrap
@256
D=A
@SP
M=D

// push constant LCL
@LCL
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant ARG
@ARG
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant THIS
@THIS
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant THAT
@THAT
D=A
@SP
A=M
M=D
@SP
M=M+1

@5
D=A
@R13 // 5 + 0 nArgs
M=D
@SP
D=M
@R13
D=D-M // D = SP - 5 
@ARG
M=D
@SP
D=M
@LCL
M=D
// go-to Sys.init
@Sys.init
0;JMP
// function SimpleFunction.test 2
(SimpleFunction.test)
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

// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop LCL 1
@SP
M=M-1
@LCL
D=M
@1
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
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
@R14 // frame
M=D

// retAddr = *(frame - 5)
D=D-1
D=D-1
D=D-1
D=D-1
D=D-1
@R15 // retAddr
M=D

// pop ARG 0
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


// SP = ARG+1
@ARG
D=M
@SP
M=D+1

// THAT = *(frame - 1)
@R14
A=M
A=A-1
D=M
@THAT
M=D

// THIS = *(frame - 2)
@R14
A=M
A=A-1
A=A-1
D=M
@THIS
M=D

// ARG = *(frame - 3)
@R14
A=M
A=A-1
A=A-1
A=A-1
D=M
@ARG
M=D

// LCL = *(frame - 4)
@R14
A=M
A=A-1
A=A-1
A=A-1
A=A-1
D=M
@LCL
M=D

// goto retAddr
@R15
A=M
0;JMP
// Infinite loop
@END
0;JMP
