import { CodeWriter } from "./CodeWriter.ts";
import { CommandType, Parser } from "./Parser.ts";
import { PushPop } from "./Strings.ts";
import { exists } from "jsr:@std/fs/exists";

import * as path from "jsr:@std/path";
export class VMTranslator {
  public async run(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<void> {
    let fileNames: string[];
    let inputDirectory: string;
    let outputDirectory: string;
    if (await exists(inputFilePath, { isFile: false })) {
      inputDirectory = inputFilePath;
      outputDirectory = outputFilePath;
      if (await exists(outputFilePath)) {
        await Deno.remove(outputFilePath, { recursive: true });
      }
      await Deno.mkdir(outputDirectory);
      const files = Deno.readDirSync(inputFilePath);
      fileNames = files.map((file) => path.parse(file.name).name).toArray();
    } else {
      inputDirectory = path.parse(inputFilePath).dir;
      outputDirectory = path.parse(outputFilePath).dir;
      fileNames = [path.parse(inputFilePath).name];
    }

    const dirName = path.parse(inputDirectory).name;
    const outputFileName = `${dirName}.asm`;
    const outputPath = `${outputDirectory}${outputFileName}`;
    console.log(outputPath);
    const codeWriter = new CodeWriter(outputPath);


    for (const fileName of fileNames) {
      const inputFile = await Deno.open(`${inputDirectory}/${fileName}.vm`);
      await Deno.writeTextFile(`${outputDirectory}${fileName}.asm`, "", {
        create: true,
      });

      const parser = new Parser(inputFile);
      // TODO: include base directory
      codeWriter.setFileName(fileName);

      await parser.advance();

      let currentFunctionName = "";
      let returnIndex = 0;

      while (await parser.hasMoreLines()) {
        const commandType = parser.commandType();
        if (commandType === CommandType.C_ARITHMETIC) {
          await codeWriter.writeArithmetic(parser.arg1());
        }
        if (
          [CommandType.C_PUSH, CommandType.C_POP].includes(
            commandType,
          )
        ) {
          await codeWriter.writePushPop(
            commandType as
              | CommandType.C_PUSH
              | CommandType.C_POP,
            parser.arg1() as keyof PushPop,
            parseInt(parser.arg2()),
          );
        }
        if (commandType === CommandType.C_LABEL) {
          await codeWriter.writeLabel(parser.arg1());
        }
        if (commandType === CommandType.C_GOTO) {
          await codeWriter.writeGoto(parser.arg1());
        }
        if (commandType === CommandType.C_IF) {
          await codeWriter.writeIf(parser.arg1());
        }

        if (commandType === CommandType.C_FUNCTION) {
          currentFunctionName = parser.arg1();
          await codeWriter.writeFunction(
            parser.arg1(),
            parseInt(parser.arg2()),
          );
        }

        if (commandType === CommandType.C_RETURN) {
          returnIndex = 0;
          await codeWriter.writeReturn();
        }

        if (commandType === CommandType.C_CALL) {
          returnIndex++;
          await codeWriter.writeCall(
            parser.arg1(),
            parseInt(parser.arg2()),
            currentFunctionName,
            returnIndex,
          );
        }
        await parser.advance();
      }

      await codeWriter.end();
    }
  }
}
