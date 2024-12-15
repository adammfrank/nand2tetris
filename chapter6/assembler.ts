import { Code } from "./code.ts";
import { InstructionType, Parser } from "./parser.ts";

export class Assembler {
    public async run(
        inputFilePath: string,
        outputFilePath: string,
    ): Promise<void> {
        const inputFile = await Deno.open(inputFilePath);

        await Deno.writeTextFile(outputFilePath, "");

        const parser = new Parser(inputFile);
        await parser.initialize();

        const code = new Code();

        let firstLine = true;
        while (parser.hasMoreLines()) {
            const instructionType = parser.instructionType();
            if (!firstLine) {
                await Deno.writeTextFile(outputFilePath, "\n", {
                    append: true,
                });
            }
            switch (instructionType) {
                case InstructionType.L_INSTRUCTION:
                case InstructionType.A_INSTRUCTION: {
                    const symbol = parser.symbol();
                    const binary = parseInt(symbol).toString(2).padStart(
                        16,
                        "0",
                    );
                    await Deno.writeTextFile(outputFilePath, binary, {
                        append: true,
                    });
                    break;
                }
                case InstructionType.C_INSTRUCTION: {
                    const dest = parser.dest();
                    const comp = parser.comp();
                    const jump = parser.jump();

                    // console.log(`COMP ${comp} : ${code.comp(comp)}`);
                    // console.log(`DEST ${dest} : ${code.dest(dest)}`);
                    // console.log(`JUMP ${jump} : ${code.jump(jump)}`);

                    const binary = "111" +
                        code.comp(comp) +
                        code.dest(dest) +
                        code.jump(jump);

                    await Deno.writeTextFile(outputFilePath, binary, {
                        append: true,
                    });
                    break;
                }
            }
            await parser.advance();
            firstLine = false;
        }
    }
}
