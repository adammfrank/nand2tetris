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
            if (
                !firstLine && instructionType !== InstructionType.L_INSTRUCTION
            ) {
                await Deno.writeTextFile(outputFilePath, "\n", {
                    append: true,
                });
            }
            switch (instructionType) {
                case InstructionType.A_INSTRUCTION: {
                    let symbol = parser.symbol();

                    // Convert variable and label symbols after preprocessing
                    if (symbol.match(/[^0-9]/)) {
                        this.symbolTable.storeVar(parser.symbol());
                        symbol = this.symbolTable.getSymbol(symbol);
                    }
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
            if (parser.instructionType() === InstructionType.L_INSTRUCTION) {
                const labelLine = curLine;
                this.symbolTable.storeLabel(parser.symbol(), labelLine);
            } else {
                curLine++;
            }
            await parser.advance();
        }
    }
}
