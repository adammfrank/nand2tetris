import { describe, test } from "jsr:@std/testing/bdd";
import { JackAnalyzer } from "../JackAnalyzer.ts";
import { expect } from "jsr:@std/expect/expect";

describe("JackAnalyzer", () => {
  let sut: JackAnalyzer;

  describe("Tokens", () => {
    test("Main.jack", () => {
      const outputPath = `${Deno.cwd()}/test/actualOutput/MainT.xml`;
      const expectedOutputPath = `${Deno.cwd()}/test/expectedOutput/MainT.xml`;
      sut = new JackAnalyzer(`${Deno.cwd()}/test/input/Main.jack`, outputPath);
      sut.analyze();

      const actualOutput = Deno.readTextFileSync(outputPath);
      const expectedOutput = Deno.readTextFileSync(expectedOutputPath);

      expect(actualOutput).toStrictEqual(expectedOutput);
    });
    test("Square.jack", () => {
      const outputPath = `${Deno.cwd()}/test/actualOutput/SquareT.xml`;
      const expectedOutputPath =
        `${Deno.cwd()}/test/expectedOutput/SquareT.xml`;
      sut = new JackAnalyzer(
        `${Deno.cwd()}/test/input/Square.jack`,
        outputPath,
      );
      sut.analyze();

      const actualOutput = Deno.readTextFileSync(outputPath);
      const expectedOutput = Deno.readTextFileSync(expectedOutputPath);

      expect(actualOutput).toStrictEqual(expectedOutput);
    });
    test("SquareGame.jack", () => {
      const outputPath = `${Deno.cwd()}/test/actualOutput/SquareGameT.xml`;
      const expectedOutputPath =
        `${Deno.cwd()}/test/expectedOutput/SquareGameT.xml`;
      sut = new JackAnalyzer(
        `${Deno.cwd()}/test/input/SquareGame.jack`,
        outputPath,
      );
      sut.analyze();

      const actualOutput = Deno.readTextFileSync(outputPath);
      const expectedOutput = Deno.readTextFileSync(expectedOutputPath);

      expect(actualOutput).toStrictEqual(expectedOutput);
    });
  });
});
