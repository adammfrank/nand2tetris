import { TextLineStream } from "jsr:@std/streams/text-line-stream";

export enum CommandType {
    C_ARITHMETIC,
    C_PUSH,
    C_POP,
    C_LABEL,
    C_GOTO,
    C_IF,
    C_FUNCTION,
    C_RETURN,
    C_CALL,
}

const commands: Record<string, CommandType> = {
    "add": CommandType.C_ARITHMETIC,
    "sub": CommandType.C_ARITHMETIC,
    "neg": CommandType.C_ARITHMETIC,
    "eq": CommandType.C_ARITHMETIC,
    "gt": CommandType.C_ARITHMETIC,
    "lt": CommandType.C_ARITHMETIC,
    "and": CommandType.C_ARITHMETIC,
    "or": CommandType.C_ARITHMETIC,
    "not": CommandType.C_ARITHMETIC,
    "push": CommandType.C_PUSH,
    "pop": CommandType.C_POP,
    // TODO: ADD THE REST
};

export class Parser {
    private values: AsyncIterableIterator<string>;
    public currentValue: IteratorResult<string> | null = null;
    constructor(file: Deno.FsFile) {
        this.values = file.readable
            .pipeThrough(new TextDecoderStream()) // decode Uint8Array to string
            .pipeThrough(new TextLineStream())
            .values();
    }

    public hasMoreLines(): boolean {
        const result = this.currentValue === null ||
            this.currentValue.done !== true;
        return result;
    }

    public async advance(): Promise<string> {
        let value = await this.values.next();
        const skippable = /^\s*(\/\/.*)?$/; // comment or whitespace
        while (value.done !== true && value.value.match(skippable)) {
            value = await this.values.next();
        }
        this.currentValue = value;
        return value.value;
    }

    public commandType(): CommandType {
        if (!this.currentValue) {
            throw new Error("No current Value for commandType");
        }
        const command = this.currentValue.value.split(" ")[0];
        if (!Object.hasOwn(commands, command)) {
            throw new Error(
                `COMMAND_TYPE not found for ${command}`,
            );
        }

        const commandType = commands[command];

        return commandType;
    }

    public arg1(): string {
        const commandType = this.commandType();
        if (commandType === CommandType.C_ARITHMETIC) {
            return this.currentValue?.value;
        }

        if ([CommandType.C_PUSH, CommandType.C_POP].includes(commandType)) {
            return this.currentValue?.value.split(" ")[1];
        }

        return "";
    }

    public arg2(): string {
        const commandType = this.commandType();
        if (
            ![
                CommandType.C_PUSH,
                CommandType.C_POP,
                CommandType.C_FUNCTION,
                CommandType.C_CALL,
            ].includes(commandType)
        ) {
            throw new Error(`Command ${this.currentValue?.value} has no arg2`);
        }

        return this.currentValue?.value.split(" ")[2];
    }
}
