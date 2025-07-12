import { CommandType } from "./Parser.ts";
import { comp, CompState, end, logic, pop, push, PushPop } from "./Strings.ts";

/**
 * Writes given commands to an output file.
 */
export class CodeWriter {
    private compState: CompState = { count: 0 };
    private fileName?: string;
    constructor(private outputPath: string) {
    }

    public setFileName(fileName: string) {
        this.fileName = fileName;
    }

    /**
     * Footer boilerplate
     */
    public async end(): Promise<void> {
        await Deno.writeTextFile(
            this.outputPath,
            end(),
            { append: true },
        );
    }

    /**
     * Write a given arithmetic-logical command
     * @param command command string from VM code
     */
    public async writeArithmetic(command: string): Promise<void> {
        let arithAssembly: string;
        switch (command) {
            case "add":
                arithAssembly = logic().add();
                break;
            case "sub":
                arithAssembly = logic().sub();
                break;
            case "neg":
                arithAssembly = logic().neg();
                break;
            case "and":
                arithAssembly = logic().and();
                break;
            case "or":
                arithAssembly = logic().or();
                break;
            case "not":
                arithAssembly = logic().not();
                break;
            case "eq":
                arithAssembly = comp(this.compState).eq();
                break;
            case "gt":
                arithAssembly = comp(this.compState).gt();
                break;
            case "lt":
                arithAssembly = comp(this.compState).lt();
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

    /**
     * Write a push or pop command
     * @param commandType push or pop
     * @param segment memory segment
     * @param index index into the memory segment
     */
    public async writePushPop(
        commandType: CommandType.C_PUSH | CommandType.C_POP,
        segment: keyof PushPop,
        index: number,
    ): Promise<void> {
        let assembly = "";
        if (!this.fileName) {
            throw new Error("File name not found.");
        }
        if (commandType === CommandType.C_PUSH) {
            assembly = push(this.fileName)[segment](index);
        } else {
            assembly = pop(this.fileName)[segment](index);
        }
        await Deno.writeTextFile(this.outputPath, assembly, {
            append: true,
        });
    }

    public async close(): Promise<void> {}
}
