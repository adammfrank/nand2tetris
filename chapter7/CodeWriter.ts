import { CommandType } from "./Parser.ts";
import { add, push } from "./Strings.ts";

export class CodeWriter {
    constructor(private outputPath: string) {
    }

    public async setup(): Promise<void> {
        const setup = `// setup
@256
D=A
@SP
M=D
`;
        await Deno.writeTextFile(
            this.outputPath,
            setup,
        );
    }

    public async writeArithmetic(command: string): Promise<void> {
        if (command === "add") {
            const addAssembly = add();
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

            const pushAssembly = push().constant(index);
            await Deno.writeTextFile(this.outputPath, pushAssembly, {
                append: true,
            });
        } else {
            throw new Error("C_PUSH not yet implemented");
        }
    }

    public async close(): Promise<void> {}
}
