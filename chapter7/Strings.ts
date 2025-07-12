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

const segments: Record<string, string> = {
    "constant": "constant",
    "local": "LCL",
    "argument": "ARG",
    "this": "THIS",
    "that": "THAT",
    "temp": "5",
};

export interface PushPop {
    constant: (index: number) => string;
    temp: (index: number) => string;
    local: (index: number) => string;
    argument: (index: number) => string;
    this: (index: number) => string;
    that: (index: number) => string;
    pointer: (index: number) => string;
    static: (index: number) => string;
}
export const push = (fileName: string): PushPop => {
    const template = (segment: string) => (index: number) =>
        stripIndent`// push ${segment} ${index}
                       @${index}
                       D=A
                       @${segments[segment]}
                       A=D+M
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `;

    return {
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
        // Remember TEMP is different because TEMP[0] is RAM[5] not the address RAM[5] holds
        temp: (index: number) =>
            stripIndent`// push temp ${index}
                       @${index}
                       D=A
                       @5 // temp starts at RAM[5]
                       A=D+A
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
            `,
        local: template("local"),
        argument: template("argument"),
        this: template("this"),
        that: template("that"),
        pointer: (index: number) =>
            stripIndent`// push pointer ${index}
                       @${index === 0 ? "THIS" : "THAT"}
                       D=M
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
        static: (index: number) =>
            stripIndent`// push static ${index}
                        @${fileName}.${index}
                        D=M
                        @SP
                        A=M
                        M=D
                        @SP
                        M=M+1
                       `,
    };
};

export const pop = (fileName: string): PushPop => {
    const template = (segment: string) => (index: number) =>
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
        constant: () => {
            throw new Error("Pop Constant does not exist");
        },
        local: template("LCL"),
        argument: template("ARG"),
        this: template("THIS"),
        that: template("THAT"),
        // Remember TEMP is different because TEMP[0] is RAM[5] not the address RAM[5] holds
        temp: (index: number) =>
            stripIndent`// pop temp ${index}
                   @SP
                   M=M-1
                   @5 // temp starts at RAM[5]
                   D=A
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
                   
    `,
        pointer: (index: number) =>
            stripIndent`// pop pointer ${index}
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @${index === 0 ? "THIS" : "THAT"}
                   M=D
                   
    `,
        static: (index: number) =>
            stripIndent`// pop static ${index}
                           @SP
                           M=M-1
                           A=M
                           D=M
                           @${fileName}.${index}
                           M=D
                           `,
    };
};

export const logic = () => {
    function template(operation: string, assembly: string) {
        return stripIndent`
                   // ${operation}
                   @SP
                   M=M-1
                   A=M
                   D=M
                   @SP
                   M=M-1
                   A=M
                   M=${assembly}
                   @SP
                   M=M+1
    `;
    }

    return {
        add: () => template("add", "D+M"),
        sub: () => template("sub", "M-D"),
        or: () => template("or", "D|M"),
        and: () => template("and", "D&M"),
        neg: () =>
            stripIndent`// neg
                   @SP
                   M=M-1
                   A=M
                   M=-M
                   @SP
                   M=M+1`,
        not: () =>
            stripIndent`// not
                   @SP
                   M=M-1
                   A=M
                   M=!M
                   @SP
                   M=M+1
                   `,
    };
};

export interface CompState {
    count: number;
}

export const comp = (compState: CompState) => {
    const compCount = compState.count++;
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

export const branch = () => {
    const label = (label: string): string => {
        return stripIndent`// label ${label}
    (${label})`;
    };

    const goto = (label: string): string => {
        return stripIndent`// go-to ${label}
    @${label}
    0;JMP`;
    };

    const gotoIf = (label: string): string => {
        return stripIndent`
            // go-to-if ${label}
            @SP
            M=M-1
            A=M
            D=M
            @${label}
            D;JNE
            `;
    };

    return {
        label,
        goto,
        gotoIf,
    };
};
