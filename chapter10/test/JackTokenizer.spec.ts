import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect/expect";
import { JackTokenizer } from "../JackTokenizer.ts";
import { TokenType } from "../Tokens.ts";

describe("JackTokenizer", () => {
  let sut: JackTokenizer;

  describe("advance", () => {
    test("empty", () => {
      const input = "";
      sut = new JackTokenizer(input);
      expect(sut.currentToken.type).toBe(TokenType.NONE);
      expect(sut.hasMoreTokens()).toBe(false);
    });
    test("single keyword", () => {
      const input = ["class"];
      sut = new JackTokenizer(input.join(""));
      expect(sut.currentToken.type).toBe(TokenType.NONE);
      expect(sut.hasMoreTokens()).toBe(true);
      sut.advance();
      expect(sut.currentToken.type).toBe(TokenType.KEYWORD);
      expect(sut.currentToken.value).toBe(input[input.length - 1]);
      expect(sut.hasMoreTokens()).toBe(false);
    });
    test("multiple keywords", () => {
      const input = ["class", "constructor", "method"];
      sut = new JackTokenizer(input.join(""));
      expect(sut.currentToken.type).toBe(TokenType.NONE);
      expect(sut.hasMoreTokens()).toBe(true);
      for (const token of input) {
        sut.advance();
        expect(sut.currentToken.type).toBe(TokenType.KEYWORD);
        expect(sut.currentToken.value).toBe(token);
      }
      expect(sut.currentToken.value).toBe(input[input.length - 1]);
      expect(sut.hasMoreTokens()).toBe(false);
    });
  });
});
