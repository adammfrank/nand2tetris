import { CodeWriter } from "./CodeWriter.ts";
import { CommandType, Parser } from "./Parser.ts";
import { PushPop } from "./Strings.ts";

import * as path from "jsr:@std/path";
export class VMTranslator {
    public async run(
        inputFilePath: string,
        outputFilePath: string,
    ): Promise<void> {
        // TODO: Move this into CodeWriter
        const inputFile = await Deno.open(inputFilePath);
        await Deno.writeTextFile(outputFilePath, "");

        const parser = new Parser(inputFile);

        const fileName = path.parse(outputFilePath).name;
        const codeWriter = new CodeWriter(outputFilePath);
        codeWriter.setFileName(fileName);

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
                await codeWriter.writePushPop(
                    parser.commandType() as
                        | CommandType.C_PUSH
                        | CommandType.C_POP,
                    parser.arg1() as keyof PushPop,
                    parseInt(parser.arg2()),
                );
            }
            await parser.advance();
        }

        await codeWriter.end();
    }
}
