import { CommandType } from "./Parser.ts";
import { add, and, comp, neg, not, or, push, sub } from "./Strings.ts";

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
        let arithAssembly: string;
        switch (command) {
            case "add":
                arithAssembly = add();
                break;
            case "sub":
                arithAssembly = sub();
                break;
            case "neg":
                arithAssembly = neg();
                break;
            case "and":
                arithAssembly = and();
                break;
            case "or":
                arithAssembly = or();
                break;
            case "not":
                arithAssembly = not();
                break;
            case "eq":
                arithAssembly = comp().eq();
                break;
            case "gt":
                arithAssembly = comp().gt();
                break;
            case "lt":
                arithAssembly = comp().lt();
                break;
            default:
                throw new Error(`${command} not yet implemented`);
        }
        await Deno.writeTextFile(
            this.outputPath,
            arithAssembly,
            {
                append: true,
            },
        );
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
            throw new Error("C_POP not yet implemented");
        }
    }

    public async close(): Promise<void> {}
}
