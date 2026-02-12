import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod"
import { pool } from "./db.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "postgres-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "runSelect",
    {
      description: `Run a select query on the postgres database to fetch required result set. 
      This can contain WHERE, JOIN, HAVING, etc clause that are used to fetch complex set of results`,
      inputSchema: {
        query: z
          .string()
          .describe("The SELECT query to be run on the postgres database"),
      },
    },
    async ({ query }) => {
      console.log("Query to be Run: ",query);
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

  server.registerTool(
    "runInsert",
    {
      description: "Run a INSERT query on the postgres database to insert new data in different tables",
      inputSchema: {
        query: z.string().describe("INSERT query to be run on the postgres database")
      }
    },
    async ({query}) => {
      console.log("Query to be Run: ",query);
      if (!query.trim().toUpperCase().startsWith("INSERT")) {
        throw new Error("Only INSERT allowed in this tool.");
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
  )


  // ✅ LIST TABLES TOOL
  server.registerTool(
    "listTables",
    {
      description: "This list all the tables in the database",
      inputSchema: {
        schemaName: z.string().describe("Name of the schema from which tables will be fetched")
      }
    },
    async ({schemaName}) => {

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
  );

  return server;
}