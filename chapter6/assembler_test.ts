import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { Assembler } from "./assembler.ts";
import { expect } from "jsr:@std/expect/expect";

describe("Assembler", () => {
    let sut: Assembler;

    beforeEach(() => {
        sut = new Assembler();
    });

    describe("No Symbols", () => {
        it("should assemble Add correctly", async () => {
            const inputPath = "./test_files/Add.asm";
            const outputPath = "./output/Add.hack";

            await sut.run(inputPath, outputPath);

            const expected = await Deno.readTextFile("./test_files/Add.hack");
            const actual = await Deno.readTextFile("./output/Add.hack");

            expect(actual).toStrictEqual(expected);
        });
        it("should assemble Max correctly", async () => {
            const inputPath = "./test_files/MaxL.asm";
            const outputPath = "./output/MaxL.hack";

            await sut.run(inputPath, outputPath);

            const expected = await Deno.readTextFile("./test_files/MaxL.hack");
            const actual = await Deno.readTextFile("./output/MaxL.hack");

            expect(actual).toStrictEqual(expected);
        });
        it("should assemble Rect correctly", async () => {
            const inputPath = "./test_files/RectL.asm";
            const outputPath = "./output/RectL.hack";

            await sut.run(inputPath, outputPath);

            const expected = await Deno.readTextFile("./test_files/RectL.hack");
            const actual = await Deno.readTextFile(outputPath);

            expect(actual).toStrictEqual(expected);
        });
    });

    describe("Yes Symbols", () => {
        it("should assemble Max correctly", async () => {
            const inputPath = "./test_files/Max.asm";
            const outputPath = "./output/Max.hack";

            await sut.preProcess(inputPath);

            await sut.run(inputPath, outputPath);

            const expected = await Deno.readTextFile("./test_files/Max.hack");
            const actual = await Deno.readTextFile("./output/Max.hack");

            expect(actual).toStrictEqual(expected);
        });
        it("should assemble Rect correctly", async () => {
            const inputPath = "./test_files/Rect.asm";
            const outputPath = "./output/Rect.hack";

            await sut.preProcess(inputPath);
            await sut.run(inputPath, outputPath);

            const expected = await Deno.readTextFile("./test_files/Rect.hack");
            const actual = await Deno.readTextFile(outputPath);

            expect(actual).toStrictEqual(expected);
        });
    });
});
