import z from "zod";
import { MCPTool } from "../interfaces/MCPTool.js";
import { pool } from "../core/db.js";

export const SelectQueryTool: MCPTool = {
    name: "selectQuery",
    description: "Runs SELECT query on the postgres database.",
    inputSchema: z.object({
        query: z.string().describe("The SELECT query to be run on the postgres database.")
    }),
    outputSchema: z.object({
        data: z.array(z.any()).describe("The data returned from the SELECT query."),
    }),
    execute: async ({ query }) => {
        console.log("Query to be Run: ",query);
        if (!query.trim().toUpperCase().startsWith("SELECT")) {
            throw new Error("Only SELECT allowed in this tool.");
        }

        const res = await pool.query(query);
        const structuredContent = { data: res.rows };

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(res.rows, null, 2),
                },
            ],
            structuredContent,
        };
    }
}