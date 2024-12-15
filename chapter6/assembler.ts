import { Code } from "./code.ts";
import { InstructionType, Parser } from "./parser.ts";
import { SymbolTable } from "./test_files/symbol_table.ts";

export class Assembler {
    private symbolTable = new SymbolTable();

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

    public async preProcess(inputFilePath: string): Promise<void> {
        const inputFile = await Deno.open(inputFilePath);
        const parser = new Parser(inputFile);
        await parser.initialize();
        let curLine = 0;

        while (parser.hasMoreLines()) {
            if (parser.hasSymbol()) {
                if (
                    parser.instructionType() === InstructionType.L_INSTRUCTION
                ) {
                    this.symbolTable.storeLabel(parser.symbol(), curLine + 1);
                }
                if (
                    parser.instructionType() === InstructionType.A_INSTRUCTION
                ) {
                    this.symbolTable.storeVar(parser.symbol());
                }
            }
            parser.advance();
            curLine++;
        }

        console.log(this.symbolTable.getTable());
    }
}
