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
// function Main.fibonacci 0
(Main.fibonacci)
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
// push constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
// lt
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
D=M-D
@TRUE_RESULT0
D;JLT
@FALSE_RESULT0
D;JGE

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
// go-to-if N_LT_2
@SP
M=M-1
A=M
D=M
@N_LT_2
D;JNE
// go-to N_GE_2
@N_GE_2
0;JMP
// label N_LT_2
(N_LT_2)
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
// label N_GE_2
(N_GE_2)
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
// push constant 2
@2
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
// call Main.fibonacci 1
// push constant Main.fibonacci.$ret.1
@Main.fibonacci.$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1

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
@1
D=D+A
@R13 // 5 + nArgs
M=D
@SP
D=M
@R13
D=D-M // D = SP - (5 + nArgs)
@ARG
M=D
@SP
D=M
@LCL
M=D
// go-to Main.fibonacci
@Main.fibonacci
0;JMP

(Main.fibonacci.$ret.1)
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
// call Main.fibonacci 1
// push constant Main.fibonacci.$ret.2
@Main.fibonacci.$ret.2
D=A
@SP
A=M
M=D
@SP
M=M+1

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
@1
D=D+A
@R13 // 5 + nArgs
M=D
@SP
D=M
@R13
D=D-M // D = SP - (5 + nArgs)
@ARG
M=D
@SP
D=M
@LCL
M=D
// go-to Main.fibonacci
@Main.fibonacci
0;JMP

(Main.fibonacci.$ret.2)
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
// function Sys.init 0
(Sys.init)
// push constant 4
@4
D=A
@SP
A=M
M=D
@SP
M=M+1
// call Main.fibonacci 1
// push constant Sys.init.$ret.1
@Sys.init.$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1

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
@1
D=D+A
@R13 // 5 + nArgs
M=D
@SP
D=M
@R13
D=D-M // D = SP - (5 + nArgs)
@ARG
M=D
@SP
D=M
@LCL
M=D
// go-to Main.fibonacci
@Main.fibonacci
0;JMP

(Sys.init.$ret.1)
// label END
(END)
// go-to END
@END
0;JMP
// Infinite loop
@END
0;JMP
