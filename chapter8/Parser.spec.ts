import { beforeEach, describe, it, test } from "jsr:@std/testing/bdd";
import { CommandType, Parser } from "./Parser.ts";
import { expect } from "jsr:@std/expect/expect";

describe("Parser", () => {
    let sut: Parser;

    describe("SimpleAdd", () => {
        beforeEach(async () => {
            const file = await Deno.open("./test_files/input/SimpleAdd.vm");
            sut = new Parser(file);
        });

        test("hasMoreLines and advance", async () => {
            expect(sut.hasMoreLines()).toBe(true);
            await sut.advance();
            await sut.advance();
            await sut.advance();
            await sut.advance();
            expect(sut.hasMoreLines()).toBe(false);
        });

        test("commandType", async () => {
            await sut.advance();
            expect(sut.commandType()).toStrictEqual(CommandType.C_PUSH);

            await sut.advance();
            expect(sut.commandType()).toStrictEqual(CommandType.C_PUSH);

            await sut.advance();
            expect(sut.commandType()).toStrictEqual(CommandType.C_ARITHMETIC);
        });
        test("arg1", async () => {
            await sut.advance();
            expect(sut.arg1()).toStrictEqual("constant");

            await sut.advance();
            expect(sut.arg1()).toStrictEqual("constant");

            await sut.advance();
            expect(sut.arg1()).toStrictEqual("add");
        });
        test("arg2", async () => {
            await sut.advance();
            expect(sut.arg2()).toStrictEqual("7");

            await sut.advance();
            expect(sut.arg2()).toStrictEqual("8");

            await sut.advance();
            expect(() => sut.arg2()).toThrow();
        });
    });
});
