// push constant 10
@10
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
// push constant 21
@21
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 22
@22
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop ARG 2
@SP
M=M-1
@ARG
D=M
@2
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// pop ARG 1
@SP
M=M-1
@ARG
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
// push constant 36
@36
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop THIS 6
@SP
M=M-1
@THIS
D=M
@6
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// push constant 42
@42
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 45
@45
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop THAT 5
@SP
M=M-1
@THAT
D=M
@5
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// pop THAT 2
@SP
M=M-1
@THAT
D=M
@2
D=D+A
@R13
M=D
@SP
A=M 
D=M
@R13
A=M
M=D
// push constant 510
@510
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop temp 6
@SP
M=M-1
@5 // temp starts at RAM[5]
D=A
@6
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
// push that 5
@5
D=A
@THAT
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
// push this 6
@6
D=A
@THIS
A=D+M
D=M
@SP
A=M
M=D
@SP
M=M+1
// push this 6
@6
D=A
@THIS
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
// push temp 6
@6
D=A
@5 // temp starts at RAM[5]
A=D+A
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
// label END
(END)
// Infinite loop
@END
0;JMP
