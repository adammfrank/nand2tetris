import { describe, test } from "jsr:@std/testing/bdd";
import { VMTranslator } from "./VMTranslator.ts";
import { expect } from "jsr:@std/expect/expect";

describe("VMTranslator", () => {
    let sut: VMTranslator;

    const TESTS = [
        "SimpleAdd",
        "StackTest",
        "BasicTest",
        "PointerTest",
        "StaticTest",
    ];

    for (const t of TESTS) {
        sut = new VMTranslator();
        describe(t, () => {
            const inputFilePath = `./test_files/input/${t}.vm`;
            const outputFilePath = `./test_files/actual_output/${t}.asm`;

            test("run", async () => {
                await sut.run(inputFilePath, outputFilePath);
                const expected = await Deno.readTextFile(
                    `./test_files/expected_output/${t}.asm`,
                );
                const actual = await Deno.readTextFile(
                    `./test_files/actual_output/${t}.asm`,
                );

                expect(actual).toStrictEqual(expected);
            });
        });
    }
});
