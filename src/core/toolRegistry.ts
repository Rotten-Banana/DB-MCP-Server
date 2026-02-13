// core/toolRegistry.ts
import fs from "fs";
import path from "path";
import { MCPTool } from "../interfaces/MCPTool.js";

export async function loadTools(): Promise<MCPTool[]> {
  const toolsDir = path.join(import.meta.dirname, "../tools");

  const files = fs.readdirSync(toolsDir);

  const tools = await Promise.all(
    files.map(async (file) => {
      const mod = await import(path.join(toolsDir, file));
      return Object.values(mod)[0] as MCPTool;
    })
  );

  return tools;
}
