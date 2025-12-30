import { TokenException } from "./Errors.ts";
import { KeywordMap, Patterns, Token, TokenType, Keyword } from "./Tokens.ts";

const CommentPatterns = [
  /\/\/.*(?:\r\n|\r|\n)?/g,            // line comments // ... (single line) + trailing newline
  /\/\*\*[\s\S]*?\*\/(?:\r\n|\r|\n)?/g, // doc comments /** ... */ (multi-line) + trailing newline
  /\/\*[\s\S]*?\*\/(?:\r\n|\r|\n)?/g     // block comments /* ... */ (multi-line) + trailing newline
];

export class JackTokenizer {
  private position: number;
  public currentToken: Token = new Token(TokenType.NONE, "");
  private text: string = "";

  constructor(input: string) {
    this.text = input.replaceAll(CommentPatterns[0], "")
    .replaceAll(CommentPatterns[1], "")
    .replaceAll(CommentPatterns[2], "");

    this.position = 0;
  }

  private remainder(): string {
    return this.text.substring(this.position);
  }

  hasMoreTokens(): boolean {
    return this.remainder().trim().length > 0;
  }

  // Run all regexs on remainder, return first/longest match
  advance(): void {
    const whitespaceMatches = this.remainder().match(/^\s+/);
    if(whitespaceMatches != null) {
        this.position += whitespaceMatches[0].length;
    }

    for (const [pattern, type] of Patterns) {
      const matches = this.remainder().match(pattern);
      if (matches != null) {
        this.currentToken.value = matches[0];
        this.currentToken.type = type;
        this.position += this.currentToken.value.length;
        break;
      }
    }
  }

  tokenType(): TokenType {
    return this.currentToken.type;
  }

  keyWord(): Keyword {
    if(!KeywordMap.has(this.currentToken.value)) throw new TokenException(`${this.currentToken.value} is not a KEYWORD`);
    return KeywordMap.get(this.currentToken.value)!;
  }

  symbol(): string {
    return this.currentToken.value;
  }

  identifier(): string {
    return this.currentToken.value;
  }

  intVal(): string {
    return this.currentToken.value;
  }

  stringVal(): string {
    return this.currentToken.value;
  }
}
