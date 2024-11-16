// 32 colums x 16 rows
@i
M=0
@8192
D=A
@end
M=D
@color
M=0

(LOOP)
// if i == 8192 then stop
@i
D=M
@end
D=M-D
@RESETCURSOR
D;JEQ

// if KBD != 0 then color = -1
@KBD
D=M
@WHITE
D;JEQ
(BLACK) //reversed for testing
@color
D=M
M=-1
@RESETCURSOR
D;JEQ // If color was 0 before
@CONTINUE
0;JMP
(WHITE)
@color
D=M
M=0
@RESETCURSOR
D;JNE // If color wasn't 0 before
@CONTINUE
0;JMP

(RESETCURSOR)
@i
M=0

// Set current cursor to color
(CONTINUE)
@i
D=M
@SCREEN
D=D+A
@cursor
M=D
@color
D=M
@cursor
A=M
M=D

@i // col = col+1
M=M+1

@LOOP
0;JMP
