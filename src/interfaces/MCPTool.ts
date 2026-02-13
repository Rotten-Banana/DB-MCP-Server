import z from "zod";

export interface MCPTool<TInput = any, TOutput = any> {
    name: string;
    description: string;
    inputSchema: z.ZodSchema<TInput>;
    outputSchema?: z.ZodSchema<TOutput>;
    execute: (input: TInput) => Promise<TOutput>;
}