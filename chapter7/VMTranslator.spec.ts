import { beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { VMTranslator } from "./VMTranslator.ts";
import { expect } from "jsr:@std/expect/expect";

describe("VMTranslator", () => {
    let sut: VMTranslator;
    beforeEach(() => {
        sut = new VMTranslator();
    });

    describe("SimpleAdd", () => {
        const inputFilePath = "./test_files/input/SimpleAdd.vm";
        const outputFilePath = "./test_files/actual_output/SimpleAdd.asm";

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
    describe("StackTest", () => {
        const inputFilePath = "./test_files/input/StackTest.vm";
        const outputFilePath = "./test_files/actual_output/StackTest.asm";

        test("run", async () => {
            await sut.run(inputFilePath, outputFilePath);
            const expected = await Deno.readTextFile(
                "./test_files/expected_output/StackTest.asm",
            );
            const actual = await Deno.readTextFile(
                "./test_files/actual_output/StackTest.asm",
            );

            const result = expected === actual;

            expect(actual).toStrictEqual(expected);
        });
    });
    describe("BasicTest", () => {
        const inputFilePath = "./test_files/input/BasicTest.vm";
        const outputFilePath = "./test_files/actual_output/BasicTest.asm";

        test("run", async () => {
            await sut.run(inputFilePath, outputFilePath);
            // const expected = await Deno.readTextFile(
            //     "./test_files/expected_output/BasicTest.asm",
            // );
            // const actual = await Deno.readTextFile(
            //     "./test_files/actual_output/BasicTest.asm",
            // );

            // const result = expected === actual;

            // console.log("RESULT " + result);

            // expect(actual).toStrictEqual(expected);
        });
    });
});
