import { CommandType } from "./Parser.ts";
import {
    add,
    and,
    comp,
    CompState,
    end,
    neg,
    not,
    or,
    pop,
    push,
    sub,
} from "./Strings.ts";

import * as path from "jsr:@std/path";
/**
 * Writes given commands to an output file.
 */
export class CodeWriter {
    private compState: CompState = { count: 0 };
    private fileName: string;
    constructor(private outputPath: string) {
        this.fileName = path.parse(outputPath).name;
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
                    assembly = push().this(index);
                    break;
                case "that":
                    assembly = push().that(index);
                    break;
                case "temp":
                    assembly = push().temp(index);
                    break;
                case "pointer":
                    if (index !== 0 && index !== 1) {
                        throw new Error(
                            `pointer index {$index} does not exist`,
                        );
                    }
                    assembly = push().pointer(index);
                    break;
                case "static":
                    assembly = push().static(this.fileName, index);
                    break;

                default:
                    throw new Error(`push ${segment} not yet implemented`);
            }
        } else {
            switch (segment) {
                case "local":
                    assembly = pop().local(index);
                    break;
                case "argument":
                    assembly = pop().argument(index);
                    break;
                case "this":
                    assembly = pop().this(index);
                    break;
                case "that":
                    assembly = pop().that(index);
                    break;
                case "temp":
                    assembly = pop().temp(index);
                    break;
                case "pointer":
                    if (index !== 0 && index !== 1) {
                        throw new Error(
                            `pointer index {$index} does not exist`,
                        );
                    }
                    assembly = pop().pointer(index);
                    break;
                case "static":
                    assembly = pop().static(this.fileName, index);
                    break;

                default:
                    throw new Error(`pop ${segment} not yet implemented`);
            }
        }
        await Deno.writeTextFile(this.outputPath, assembly, {
            append: true,
        });
    }

    public async close(): Promise<void> {}
}
