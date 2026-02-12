import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { deleteMCPHandler, getMCPHandler, postMCPHandler } from "./endpointHandlers.js";

const app = createMcpExpressApp();

// Handle POST requests for client-to-server communication
app.post('/mcp', postMCPHandler);
  
// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp', getMCPHandler);

// Handle DELETE requests for session termination
app.delete('/mcp', deleteMCPHandler);
  
app.listen(3000, (error: Error | undefined) => {
  if (error) {
    console.error("Error starting MCP server:", error);
    return;
  }
  console.log("Store MCP Server running on http://localhost:3000/mcp");
});