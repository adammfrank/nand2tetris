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

/**
 * Map command strings to CommandType
 */
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
    "label": CommandType.C_LABEL,
    "goto": CommandType.C_GOTO,
    "if-goto": CommandType.C_IF,
    "function": CommandType.C_FUNCTION,
    "return": CommandType.C_RETURN,
    "call": CommandType.C_CALL
};

/**
 * Reads the file and provides methods for parsing command and arguments
 * of each line
 */
export class Parser {
    private values: AsyncIterableIterator<string>;
    public currentValue: IteratorResult<string> | null = null;
    constructor(file: Deno.FsFile) {
        this.values = file.readable
            .pipeThrough(new TextDecoderStream()) // decode Uint8Array to string
            .pipeThrough(new TextLineStream())
            .values();
    }

    /**
     * this.currentValue is null if we haven't started yet
     * @returns True if file has more lines to read
     */
    public hasMoreLines(): boolean {
        const result = this.currentValue === null ||
            this.currentValue.done !== true;
        return result;
    }

    /**
     * Gets the next line in the file and both saves it in this.currentValue
     * and returns it.
     * @returns The current line after advancing
     */
    public async advance(): Promise<string> {
        let value = await this.values.next();
        const skippable = /^\s*(\/\/.*)?$/; // comment or whitespace
        while (value.done !== true && value.value.match(skippable)) {
            value = await this.values.next();
        }
        this.currentValue = value;
        return value.value;
    }

    /**
     * Parses the line's first word into its CommandType
     * @returns the CommandType
     */
    public commandType(): CommandType {
        if (!this.currentValue) {
            throw new Error("No current Value for commandType");
        }
        // TODO: Shouldn't need to do this 3 times
        const command = this.currentValue.value.trim().split(/\s+/)[0];
        if (!Object.hasOwn(commands, command)) {
            throw new Error(
                `COMMAND_TYPE not found for ${command}`,
            );
        }

        const commandType = commands[command];

        return commandType;
    }

    /**
     * Return the first word of the line. If command type is C_ARITHMETIC,
     * return the command (the line has no other arguments).
     * Otherwise, return the second word of the line.
     * @returns The first argument of the line
     */
    public arg1(): string {
        const commandType = this.commandType();
        if (commandType === CommandType.C_ARITHMETIC) {
            // TODO: Shouldn't need to do this 3 times
            return this.currentValue?.value.trim().split(/\s+/)[0];
        }

        return this.currentValue?.value.trim().split(" ")[1];
    }

    /**
     * Return the second word of the line.
     * Only valid for C_PUSH, C_POP, C_FUNCTION, and C_CALL
     * @returns The second argument of the line.
     */
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

        return this.currentValue?.value.trim().split(" ")[2];
    }
}
