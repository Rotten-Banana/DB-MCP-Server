import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadTools } from "./core/toolRegistry.js";

export async function createServer(): Promise<McpServer> {
  const server = new McpServer({
    name: "postgres-mcp",
    version: "1.0.0",
  });

  const tools = await loadTools();
  tools.forEach((tool) => {
    server.registerTool(
      `${tool.name}`,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      },
      tool.execute,
    )
  })

  return server;
}