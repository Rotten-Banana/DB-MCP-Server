import z from "zod";
import { MCPTool } from "../interfaces/MCPTool.js";
import { pool } from "../core/db.js";

export const ListTablesTool: MCPTool = {
    name: "listTables",
    description: "List all the Tables in a database schema.",
    inputSchema: z.object({
        schemaName: z.string().describe("Name of the schema for which tables will be listed.")
    }),
    outputSchema: z.object({
        tables: z.array(z.string()).describe("List of tables in the schema.")
    }),
    execute: async ({schemaName}) => {

        const res = await pool.query(`
          SELECT tablename
          FROM pg_catalog.pg_tables
          WHERE schemaname='${schemaName}';
        `);
  
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(res.rows, null, 2),
            },
          ],
        };
    }
}