import { TokenException } from "./Errors.ts";
import { KeywordMap, Patterns, Token, TokenType, Keyword } from "./Tokens.ts";

export class JackTokenizer {
  private position: number;
  public currentToken: Token = new Token(TokenType.NONE, "");

  constructor(private input: string) {
    this.position = 0;
  }

  private remainder(): string {
    return this.input.substring(this.position);
  }

  hasMoreTokens(): boolean {
    return this.remainder().length > 0;
  }

  // Run all regexs on remainder, return first/longest match
  advance(): void {
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
