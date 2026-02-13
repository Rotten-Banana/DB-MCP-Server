import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "../server.js";

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

export const postMCPHandler = async (req: Request, res: Response) => {
  console.log("MCP POST endpoint hit!");
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (sessionId) {
      console.log(`Received MCP request for session: ${sessionId}`);
  } else {
      console.log('Request body:', req.body);
  }

  try{
    let transport: StreamableHTTPServerTransport;
    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      console.log(`Existing transport use for session: ${sessionId}`);
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      console.log(`No transport found for session: ${sessionId}`);
      console.log('Creating new Transport');
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          console.log(`Session initialized with ID: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });
  
      // Set up onclose handler to clean up transport when closed
      transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) {
              console.log(`Transport closed for session ${sid}, removing from transports map`);
              delete transports[sid];
          }
      };
  
      // Connect to the MCP server
      const server = await createServer();
      await server.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
          res.status(500).json({
              jsonrpc: '2.0',
              error: {
                  code: -32_603,
                  message: 'Internal server error'
              },
              id: null
          });
      }
  }
};
  
// Reusable handler for GET and DELETE requests
export const getMCPHandler = async (req: Request, res: Response) => {
  console.log("MCP GET endpoint hit!");
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    console.log("Session Id not found!");
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  console.log("Session Id found: ",sessionId);
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

export const deleteMCPHandler = async (req: Request, res: Response) => {
  console.log("MCP DELETE endpoint hit!");
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    console.log("Session Id not found!");
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  console.log("Session Id found: ",sessionId);
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};