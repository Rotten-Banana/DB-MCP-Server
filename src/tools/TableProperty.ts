import z from "zod";
import { MCPTool } from "../interfaces/MCPTool.js";
import { pool } from "../core/db.js";

export const TablePropertyTool: MCPTool = {
    name: "tableProperty",
    description: "Get the properties of a table in a database schema.",
    inputSchema: z.object({
        tableName: z.string().describe("Name of the table for which properties will be fetched."),
        schemaName: z.string().describe("Name of the schema for which the table belongs to.")
    }),
    execute: async ({tableName, schemaName}) => {

        const res = await pool.query(`
          SELECT 
            column_name, 
            data_type, 
            character_maximum_length, 
            is_nullable, 
            column_default 
        FROM 
            information_schema.columns 
        WHERE 
            table_schema = '${schemaName}' AND 
            table_name = '${tableName}'
        ORDER BY 
            ordinal_position;
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