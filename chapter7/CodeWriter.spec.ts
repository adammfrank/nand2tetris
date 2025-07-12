import { beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { CodeWriter } from "./CodeWriter.ts";
import { expect } from "jsr:@std/expect/expect";
import { CommandType } from "./Parser.ts";
import { logic, push } from "./Strings.ts";
import * as path from "jsr:@std/path";

describe("CodeWriter", () => {
    const outputPath = "./test_files/actual_output/CodeWriter.asm";
    const fileName = path.parse(outputPath).name;
    let sut: CodeWriter;
    beforeEach(async () => {
        sut = new CodeWriter(outputPath);
        sut.setFileName(fileName);
        await Deno.writeTextFile(outputPath, "");
    });

    describe("writeArithmetic", () => {
        test("add", async () => {
            await sut.writeArithmetic("add");
            const expected = logic().add();
            const actual = await Deno.readTextFile(
                outputPath,
            );
            expect(actual).toStrictEqual(expected);
        });

        test("push constant", async () => {
            const index = 7;
            await sut.writePushPop(CommandType.C_PUSH, "constant", index);
            const expected = push(fileName).constant(7);

            const actual = await Deno.readTextFile(
                outputPath,
            );
            expect(actual).toStrictEqual(expected);
        });
    });
});
