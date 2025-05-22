function stripIndent(
    strings: TemplateStringsArray,
    ...values: unknown[]
): string {
    const raw = strings
        .map((str, i) => str + (values[i] ?? ""))
        .join("");

    // Split into lines, remove all leading spaces, and join
    return raw
        .split("\n")
        .map((line) => line.trimStart()) // Remove all leading spaces
        .join("\n")
        .trim() // Remove leading and trailing empty lines
        .concat("\n"); // Add new line at end;
}
export const push = () => ({
    constant: (index: number) =>
        stripIndent`// push constant ${index}
                       @${index}
                       D=A
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
    local: (index: number) =>
        /**
         * Load index into D
         * Get value stored at RAM[1 + index]
         * Store value on stack
         * Increment stack pointer
         */
        stripIndent`// push local ${index}
                       @${index}
                       D=A
                       @LCL
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
    argument: (index: number) =>
        stripIndent`// push argument ${index}
                       @${index}
                       D=A
                       @ARG
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
    this: (index: number) =>
        stripIndent`// push this ${index}
                       @${index}
                       D=A
                       @THIS
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
    that: (index: number) =>
        stripIndent`// push this ${index}
                       @${index}
                       D=A
                       @THAT
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
    temp: (index: number) =>
        stripIndent`// push this ${index}
                       @${index}
                       D=A
                       @THAT
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
});

export const pop = () => {
    const template = (segment: string) => (index: string) =>
        stripIndent`// pop ${segment} ${index}
                   @SP
                   M=M-1
                   @${segment}
                   D=M
                   @${index}
                   D=D+A
                   @R13
                   M=D
                   @SP
                   A=M 
                   D=M
                   @R13
                   A=M
                   M=D
                   
    `;

    return {
        local: template("LCL"),
        argument: template("ARG"),
        this: template("THIS"),
        that: template("THAT"),
        temp: template("TEMP"),
    };
};

export const add = () =>
    // A=M Deref stack pointer to get value on top of stack
    // D=M Save top value into D
    stripIndent`// add
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
`;
export const sub = () =>
    stripIndent`// sub
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
`;

export const neg = () =>
    stripIndent`// neg
                   @SP
                   M=M-1
                   A=M
                   M=-M
                   @SP
                   M=M+1
`;
export const not = () =>
    stripIndent`// not
                   @SP
                   M=M-1
                   A=M
                   M=!M
                   @SP
                   M=M+1
`;

export const or = () =>
    stripIndent`// or
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   M=D|M
                   @SP
                   M=M+1
`;
export const and = () =>
    stripIndent`// and
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   M=D&M
                   @SP
                   M=M+1
`;

let compCount = -1;
export const comp = () => {
    compCount++;
    return {
        eq: () =>
            stripIndent`// eq
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   D=M-D
                   @TRUE_RESULT${compCount}
                   D;JEQ
                   @FALSE_RESULT${compCount}
                   D;JNE
                   
                   (FALSE_RESULT${compCount})
                   @SP
                   A=M
                   M=0
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP
                   
                   (TRUE_RESULT${compCount})
                   @SP
                   A=M
                   M=-1
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP

                   (CONTINUE${compCount})
                   `,
        lt: () =>
            stripIndent`// lt
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   D=M-D
                   @TRUE_RESULT${compCount}
                   D;JLT
                   @FALSE_RESULT${compCount}
                   D;JGE
                   
                   (FALSE_RESULT${compCount})
                   @SP
                   A=M
                   M=0
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP
                   
                   (TRUE_RESULT${compCount})
                   @SP
                   A=M
                   M=-1
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP

                   (CONTINUE${compCount})
                   `,
        gt: () =>
            stripIndent`// gt
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   D=M-D
                   @TRUE_RESULT${compCount}
                   D;JGT
                   @FALSE_RESULT${compCount}
                   D;JLE
                   
                   (FALSE_RESULT${compCount})
                   @SP
                   A=M
                   M=0
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP
                   
                   (TRUE_RESULT${compCount})
                   @SP
                   A=M
                   M=-1
                   @SP
                   M=M+1
                   @CONTINUE${compCount}
                   D;JMP

                   (CONTINUE${compCount})
                   `,
    };
};

export const setup = () =>
    stripIndent`// setup
@256
D=A
@SP
M=D
`;

export const end = () =>
    stripIndent`// Infinite loop
(END)
@END
0;JMP`;
