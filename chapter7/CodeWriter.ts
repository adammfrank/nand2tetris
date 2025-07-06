import { CommandType } from "./Parser.ts";
import { comp, CompState, end, logic, pop, push, PushPop } from "./Strings.ts";

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
        if (commandType === CommandType.C_PUSH) {
            assembly = push(this.fileName)[segment](index);
            // switch (segment) {
            //     case "constant":
            //         assembly = push().constant(index);
            //         break;
            //     case "local":
            //         assembly = push().local(index);
            //         break;
            //     case "argument":
            //         assembly = push().argument(index);
            //         break;
            //     case "this":
            //         assembly = push().this(index);
            //         break;
            //     case "that":
            //         assembly = push().that(index);
            //         break;
            //     case "temp":
            //         assembly = push().temp(index);
            //         break;
            //     case "pointer":
            //         if (index !== 0 && index !== 1) {
            //             throw new Error(
            //                 `pointer index {$index} does not exist`,
            //             );
            //         }
            //         assembly = push().pointer(index);
            //         break;
            //     case "static":
            //         assembly = push().static(this.fileName, index);
            //         break;

            //     default:
            //         throw new Error(`push ${segment} not yet implemented`);
            // }
        } else {
            assembly = pop(this.fileName)[segment](index);
        }
        await Deno.writeTextFile(this.outputPath, assembly, {
            append: true,
        });
    }

    public async close(): Promise<void> {}
}
