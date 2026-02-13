import z from "zod";
import { MCPTool } from "../interfaces/MCPTool.js";
import { pool } from "../core/db.js";

export const InsertQueryTool: MCPTool = {
    name: "insertQuery",
    description: "Runs INSERT query on the postgres database.",
    inputSchema: z.object({
        query: z.string().describe("The INSERT query to be run on the postgres database.")
    }),
    execute: async ({ query }) => {
        console.log("Query to be Run: ",query);
        if (!query.trim().toUpperCase().startsWith("INSERT")) {
            throw new Error("Only INSERT allowed in this tool.");
        }

        try {
            await pool.query(query);
    
            return {
                content: [
                    {
                        type: "text",
                        text: 'INSERT query executed successfully.',
                    },
                ],
            };
        } catch (error) {
            console.error('Error executing INSERT query:', error);
            return {
                content: [
                    {
                        type: "text",
                        text: 'INSERT query failed.',
                    },
                ],
            };
        }
    }
}