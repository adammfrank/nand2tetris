import { CommandType } from "./Parser.ts";
import {
    add,
    and,
    comp,
    end,
    neg,
    not,
    or,
    pop,
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
        let assembly = "";
        if (commandType === CommandType.C_PUSH) {
            switch (segment) {
                case "constant":
                    assembly = push().constant(index);
                    break;
                case "local":
                    assembly = push().local(index);
                    break;
                case "argument":
                    assembly = push().argument(index);
                    break;
                case "this":
                    assembly = push().argument(index);
                    break;
                default:
                    throw new Error(`push ${segment} not yet implemented`);
            }
        } else {
            switch (segment) {
                case "local":
                    assembly = pop().local(index);
                    break;
                default:
                    throw new Error(`pop ${segment} not yet implemented`);
            }
            throw new Error("C_POP not yet implemented");
        }
        await Deno.writeTextFile(this.outputPath, assembly, {
            append: true,
        });
    }

    public async close(): Promise<void> {}
}
