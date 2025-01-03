import { CodeWriter } from "./CodeWriter.ts";
import { CommandType, Parser } from "./Parser.ts";

export class VMTranslator {
    public async run(
        inputFilePath: string,
        outputFilePath: string,
    ): Promise<void> {
        const inputFile = await Deno.open(inputFilePath);
        await Deno.writeTextFile(outputFilePath, "");
        const parser = new Parser(inputFile);
        const codeWriter = new CodeWriter(outputFilePath);
        await codeWriter.setup();

        await parser.advance();

        while (await parser.hasMoreLines()) {
            const curValue = parser.currentValue?.value;
            if (parser.commandType() === CommandType.C_ARITHMETIC) {
                await codeWriter.writeArithmetic(curValue);
            }
            if (
                [CommandType.C_PUSH, CommandType.C_POP].includes(
                    parser.commandType(),
                )
            ) {
                const splitCommand = curValue.split(" ");
                await codeWriter.writePushPop(
                    parser.commandType() as
                        | CommandType.C_PUSH
                        | CommandType.C_POP,
                    splitCommand[1],
                    parseInt(splitCommand[2]),
                );
            }
            await parser.advance();
        }
    }
}
