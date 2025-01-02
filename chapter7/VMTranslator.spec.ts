import { beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { VMTranslator } from "./VMTranslator.ts";
import { expect } from "jsr:@std/expect/expect";

describe("VMTranslator", () => {
    let sut: VMTranslator;
    describe("SimpleAdd", () => {
        const inputFilePath = "./test_files/input/SimpleAdd.vm";
        const outputFilePath = "./test_files/actual_output/SimpleAdd.asm";
        beforeEach(() => {
            sut = new VMTranslator();
        });

        test("run", async () => {
            await sut.run(inputFilePath, outputFilePath);
            const expected = await Deno.readTextFile(
                "./test_files/expected_output/SimpleAdd.asm",
            );
            const actual = await Deno.readTextFile(
                "./test_files/actual_output/SimpleAdd.asm",
            );

            expect(actual).toStrictEqual(expected);
        });
    });
});
