import { CommandType } from "./Parser.ts";

export class CodeWriter {
    constructor(private outputPath: string) {
    }

    public async writeArithmetic(command: string): Promise<void> {
        if (command === "add") {
            const addAssembly = `// add
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M+D
@SP
M=M+1
`;
            await Deno.writeTextFile(
                this.outputPath,
                addAssembly,
                {
                    append: true,
                },
            );
        } else {
            throw new Error(`${command} not yet implemented`);
        }
    }

    public async writePushPop(
        commandType: CommandType.C_PUSH | CommandType.C_POP,
        segment: string,
        index: number,
    ): Promise<void> {
        if (commandType === CommandType.C_PUSH) {
            // Only works for constant

            const pushAssembly = `// push constant ${index}
@${index}
D=A
@SP
A=M
M=D
@SP
M=M+1
`;
            await Deno.writeTextFile(this.outputPath, pushAssembly, {
                append: true,
            });
        } else {
            throw new Error("C_PUSH not yet implemented");
        }
    }

    public async close(): Promise<void> {}
}
