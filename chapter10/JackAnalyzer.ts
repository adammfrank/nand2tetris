import { JackTokenizer } from "./JackTokenizer.ts";
import { TokenType } from "./Tokens.ts";

export class JackAnalyzer {
  
  private tokenizers: JackTokenizer[] = [];

  constructor(private inputFilePath: string, private outputFilePath: string) {

  }

  analyze(): void {

    const decoder = new TextDecoder();
    const inputFileData = Deno.readFileSync(this.inputFilePath);
    const inputFileText = decoder.decode(inputFileData);
    this.tokenizers.push(new JackTokenizer(inputFileText))

    const file = Deno.createSync(this.outputFilePath);

    for(const tokenizer of this.tokenizers) {
        this.write("<tokens>\r\n")
        while(tokenizer.hasMoreTokens()) {
            tokenizer.advance();
            const curVal = tokenizer.currentToken.value;
            switch(tokenizer.currentToken.type) {
                case TokenType.KEYWORD:
                    this.write(`<keyword> ${curVal} </keyword>\r\n`)
                    break;
                case TokenType.SYMBOL:
                    this.write(`<symbol> ${curVal} </symbol>\r\n`)
                    break;
                case TokenType.IDENTIFIER:
                    this.write(`<identifier> ${curVal} </identifier>\r\n`)
                    break;
                case TokenType.STRING_CONST:
                    this.write(`<stringConstant> ${curVal} </stringConstant>\r\n`)
                    break;
                case TokenType.INT_CONST:
                    this.write(`<integerConstant> ${curVal} </integerConstant>\r\n`)
                    break;
                default:
                    this.write(`WTF is a ${curVal}`);
                    break;
            }
        }
        this.write("</tokens>\r\n")
    }
    file.close();
  }

  private write(output: string) {
    Deno.writeTextFileSync(this.outputFilePath, output, {append: true});
  }
}
