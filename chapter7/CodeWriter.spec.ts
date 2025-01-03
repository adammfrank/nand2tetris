import { beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { CodeWriter } from "./CodeWriter.ts";
import { expect } from "jsr:@std/expect/expect";
import { CommandType } from "./Parser.ts";

describe("CodeWriter", () => {
    const outputPath = "./test_files/actual_output/CodeWriter.asm";
    let sut: CodeWriter;
    beforeEach(async () => {
        sut = new CodeWriter(outputPath);
        await Deno.writeTextFile(outputPath, "");
    });

    describe("writeArithmetic", () => {
        test("add", async () => {
            await sut.writeArithmetic("add");
            const expected = `// add
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
M=M+D
@SP
M=M+1
`;
            const actual = await Deno.readTextFile(
                outputPath,
            );
            expect(actual).toStrictEqual(expected);
        });

        test("push constant", async () => {
            const index = 7;
            await sut.writePushPop(CommandType.C_PUSH, "constant", index);
            const expected = `// push constant 7
@${index}
D=A
@SP
A=M
M=D
@SP
M=M+1
`;

            const actual = await Deno.readTextFile(
                outputPath,
            );
            expect(actual).toStrictEqual(expected);
        });
    });
});
