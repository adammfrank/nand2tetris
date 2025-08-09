import { CommandType } from "./Parser.ts";
import {
bootstrap,
    Branch,
    branch,
    comp,
    CompState,
    end,
    logic,
    pop,
    push,
    PushPop,
} from "./Strings.ts";

/**
 * Writes given commands to an output file.
 */
export class CodeWriter {
    private compState: CompState = { count: 0 };
    private fileName?: string;
    private branch: Branch = branch("no-name");
    constructor(private outputPath: string) {
    }

    public setFileName(fileName: string) {
        this.fileName = fileName;
        this.branch = branch(this.fileName);
    }

    public async bootstrap(): Promise<void> {
       await Deno.writeTextFile(
            this.outputPath,
            bootstrap(),
            { append: true },
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

    /**
     * Write a label command
     * @param label The label to write
     */
    public async writeLabel(label: string): Promise<void> {
        const assembly = this.branch.label(label);
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }

    /**
     *  Write a go-to command for the label
     * @param label The label we go-to
     */
    public async writeGoto(label: string): Promise<void> {
        const assembly = this.branch.goto(label);
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }

    public async writeIf(label: string): Promise<void> {
        const assembly = this.branch.gotoIf(label);
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }

    public async writeFunction(name: string, nVars: number) {
        const assembly = this.branch.fn(name, nVars);
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }

    public async writeReturn() {
        const assembly = this.branch.rturn();
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }

    public async writeCall() {
        const assembly = this.branch.call();
        await Deno.writeTextFile(this.outputPath, assembly, { append: true });
    }
}
