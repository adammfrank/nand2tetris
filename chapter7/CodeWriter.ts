import { CommandType } from "./Parser.ts";
import {
    add,
    and,
    comp,
    end,
    neg,
    not,
    or,
    push,
    setup,
    sub,
} from "./Strings.ts";

/**
 * Writes given commands to an output file.
 */
export class CodeWriter {
    constructor(private outputPath: string) {
    }

    /**
     * Header boilerplate
     */
    public async setup(): Promise<void> {
        await Deno.writeTextFile(
            this.outputPath,
            setup(),
        );
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

    /**
     * Write a push or pop command
     * @param commandType push or pop
     * @param segment memory segment
     * @param index index into the memory segment
     */
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
