import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod"
import { pool } from "./db.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "postgres-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "run_select",
    {
      description: "Run a select query on the data to fetch result set",
      inputSchema: {
        query: z
          .string()
          .describe("The SELECT query to be run on the Database"),
      },
    },
    async ({ query }) => {

      if (!query.trim().toUpperCase().startsWith("SELECT")) {
        throw new Error("Only SELECT allowed in this tool.");
      }

      const res = await pool.query(query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res.rows, null, 2),
          },
        ],
      };
    }
  );


  // ✅ LIST TABLES TOOL
  server.registerTool(
    "list_tables",
    {description: "This list all the tables in the database"},
    async () => {
      const res = await pool.query(`
        SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname='projectdata';
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
  );

  return server;
}