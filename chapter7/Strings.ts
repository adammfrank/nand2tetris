function stripIndent(
    strings: TemplateStringsArray,
    ...values: unknown[]
): string {
    const raw = strings
        .map((str, i) => str + (values[i] ?? ""))
        .join("");

    // Split into lines, remove all leading spaces, and join
    return raw
        .split("\n")
        .map((line) => line.trimStart()) // Remove all leading spaces
        .join("\n")
        .trim() // Remove leading and trailing empty lines
        .concat("\n"); // Add new line at end;
}
export const push = () => ({
    constant: (index: number) =>
        stripIndent`// push constant ${index}
                       @${index}
                       D=A
                       @SP
                       A=M
                       M=D
                       @SP
                       M=M+1
                       `,
});

export const add = () =>
    stripIndent`// add
                   @SP
                   A=M
                   D=M
                   @SP
                   M=M-1
                   @SP
                   A=M
                   M=M+D
                   @SP
                   M=M+1
                   `;
