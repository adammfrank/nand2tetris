import { TextLineStream } from "@std/streams/text-line-stream";
export const enum InstructionType {
    A_INSTRUCTION,
    C_INSTRUCTION,
    L_INSTRUCTION,
}

export class Parser {
    private values: AsyncIterableIterator<string>;
    private currentValue: IteratorResult<string> | null = null;
    constructor(private file: Deno.FsFile) {
        this.values = file.readable
            .pipeThrough(new TextDecoderStream()) // decode Uint8Array to string
            .pipeThrough(new TextLineStream())
            .values();
    }

    public async initialize(): Promise<void> {
        this.currentValue = await this.values.next();
    }

    public async printAllValues(): Promise<void> {
        let value = await this.values.next();
        while (value.done !== true) {
            console.log(value.value);
            value = await this.values.next();
        }
    }

    public hasMoreLines(): boolean {
        const result = this.currentValue === null ||
            this.currentValue.done !== true;
        return result;
    }

    public async advance(): Promise<void> {
        let value = await this.values.next();
        const skippable = /^\s*(\/\/.*)?$/; // comment or whitespace
        while (value.done !== true && value.value.match(skippable)) {
            value = await this.values.next();
        }
        this.currentValue = value;
    }

    public instructionType(): InstructionType {
        const value = this.currentValue!.value as string;
        if (value.startsWith("@")) {
            return InstructionType.A_INSTRUCTION;
        } else if (value.startsWith("(")) {
            return InstructionType.L_INSTRUCTION;
        } else {
            return InstructionType.C_INSTRUCTION;
        }
    }

    public symbol(): string {
        const value = this.currentValue!.value as string;
        if (this.instructionType() === InstructionType.C_INSTRUCTION) {
            throw new Error("Attempting to get symbol of C_INSTRUCTION");
        }
        return value.replaceAll("@", "").replaceAll(/[\(\)]/g, "");
    }

    public dest(): string {
        if (this.instructionType() !== InstructionType.C_INSTRUCTION) {
            throw new Error("Attempting to get symbol of C_INSTRUCTION");
        }

        const value = this.currentValue!.value as string;
        const firstEqualsPosition = value.indexOf("=");
        return value.slice(0, firstEqualsPosition);
    }

    public comp(): string {
        if (this.instructionType() !== InstructionType.C_INSTRUCTION) {
            throw new Error("Attempting to get symbol of C_INSTRUCTION");
        }

        const value = this.currentValue!.value as string;
        const firstEqualsPosition = value.indexOf("=");
        return value.slice(firstEqualsPosition + 1, value.length);
    }

    public jump(): string {
        if (this.instructionType() !== InstructionType.C_INSTRUCTION) {
            throw new Error("Attempting to get symbol of C_INSTRUCTION");
        }

        const value = this.currentValue!.value as string;
        const semiColonPosition = value.indexOf(";");
        return value.slice(semiColonPosition + 1, value.length);
    }
}
