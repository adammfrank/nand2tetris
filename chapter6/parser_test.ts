import { assertEquals } from "jsr:@std/assert";
import { InstructionType, Parser } from "./parser.ts";
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
const filePath = "./ParserTest.asm";

describe("Parser", () => {
    let sut: Parser;
    let file: Deno.FsFile;

    beforeEach(async () => {
        file = await Deno.open(filePath);
        sut = new Parser(file);
    });

    afterEach(() => {
        try {
            file.close();
        } catch (_) {}
    });

    it("should be defined", () => {
        expect(sut).toBeDefined();
    });

    describe("hasMoreLines", () => {
        it("should return true with fresh file", () => {
            expect(sut.hasMoreLines()).toBe(true);
        });

        it("should return true in middle of file", async () => {
            await sut.advance();
            expect(sut.hasMoreLines()).toBe(true);
        });

        it("should return false at end of file", async () => {
            while (sut.hasMoreLines()) {
                await sut.advance();
            }
            expect(sut.hasMoreLines()).toBe(false);
        });
    });

    describe("instructionType", () => {
        it("should return A_INSTRUCTION", async () => {
            await sut.advance();
            expect(sut.instructionType()).toStrictEqual(
                InstructionType.A_INSTRUCTION,
            );
        });

        it("should return C_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            expect(sut.instructionType()).toStrictEqual(
                InstructionType.C_INSTRUCTION,
            );
        });
        it("should return L_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            await sut.advance();
            expect(sut.instructionType()).toStrictEqual(
                InstructionType.L_INSTRUCTION,
            );
        });
    });

    describe("symbol", () => {
        it("should get symbol of A_INSTRUCTION", async () => {
            await sut.advance();
            expect(sut.symbol()).toStrictEqual("2");
        });
        it("should throw on C_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            expect(() => sut.symbol()).toThrow();
        });
        it("should get symbol of L_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            await sut.advance();
            expect(sut.symbol()).toStrictEqual("FOO_LABEL");
        });
    });

    describe("dest", () => {
        it("should get dest of C_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            expect(sut.dest()).toStrictEqual("D");
        });
    });

    describe("comp", () => {
        it("should get comp of C_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            expect(sut.comp()).toStrictEqual("A");
        });
        it("should throw on A_INSTRUCTION", async () => {
            await sut.advance();
            expect(() => sut.comp()).toThrow(Error);
        });
    });

    describe("jump", () => {
        it("should get jump of C_INSTRUCTION", async () => {
            await sut.advance();
            await sut.advance();
            await sut.advance();
            await sut.advance();

            expect(sut.jump()).toStrictEqual("JMP");
        });
        it("should throw on A_INSTRUCTION", async () => {
            await sut.advance();
            expect(() => sut.comp()).toThrow(Error);
        });

        it('should return "null" if there is no jump', async () => {
            await sut.advance();
            await sut.advance();
            expect(sut.jump()).toStrictEqual("null");
        });
    });
});
