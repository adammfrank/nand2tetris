import { VMTranslator } from "./VMTranslator.ts";

const args = Deno.args;

if (args.length < 2) {
    console.log("Missing either input or output file");
}

const inputFilePath = args[0];
const outputFilePath = args[1];

const vmTranslator = new VMTranslator();

vmTranslator.run(inputFilePath, outputFilePath);
