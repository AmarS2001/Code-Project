import { ChunkerManager } from "./chunker";
import { Pipeline } from "./pipeline";
import { ScanService } from "./pipeline/ScanService";

import { ChatOllama } from "@langchain/ollama"
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";

async function main(args: string[]) {
  try {
    const action = args[2];
    switch (action) {
      case 'scan':
        {
          const pipeline = Pipeline.createDefault();
          const scanner = new ScanService(pipeline);
          const result = await scanner.scan(args[3]);
          console.log('\n📊 Summary:');
          console.log(`   Total: ${result.stats.totalScanned} | Accepted: ${result.stats.totalAccepted} | Rejected: ${result.stats.totalRejected} | Duration: ${result.stats.duration}ms`);
          break;
        }

      case 'chunk':
        {
          const targetPath = args[3];
          console.log(`Scanning and chunking files in ${targetPath}...`);

          const pipeline = Pipeline.createDefault();
          const scanner = new ScanService(pipeline);
          const chunker = new ChunkerManager();
          const fs = await import('fs/promises'); // Dynamic import

          let totalChunks = 0;
          let filesChunked = 0;
          const startTime = Date.now();

          // Stream files using generator
          for await (const filePath of scanner.scanStream(targetPath)) {
            try {
              const content = await fs.readFile(filePath, 'utf-8');
              const chunks = await chunker.chunk(filePath, content);

              if (chunks && chunks.length > 0) {
                totalChunks += chunks.length;
              }
              filesChunked++;
            } catch (err: any) {
              console.error(`Failed to chunk ${filePath}:`, err);
            }
          }

          const duration = Date.now() - startTime;
          console.log('\n📊 Chunking Summary:');
          console.log(`   Files Processed: ${filesChunked} | Total Chunks: ${totalChunks} | Duration: ${duration}ms`);
          break;
        }
      case 'test-mcp':
        {
          const client = new MultiServerMCPClient({
            math: {
              transport: "stdio",
              command: "node",
              args: ["/Users/amarssajjanshetty/workfolder5/projectV3/dist/math-server.js"],
            },
            filesystem: {
              transport: "stdio",
              command: "npx",
              args: [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "/Users/amarssajjanshetty/workfolder5/projectV3",
              ]
            },
            // sequentialthinking: {
            //   command: "npx",
            //   args: [
            //     "-y",
            //     "@modelcontextprotocol/server-sequential-thinking"
            //   ]
            // },
            git: {
              command: "uvx",
              args: ["mcp-server-git"]
            }
          });

          const llm = new ChatOllama({
            model: "llama3.1:8b",
            temperature: 0.6,
          })

          const tools = await client.getTools();
          const agent = createAgent({
            model: llm,
            tools,
          });

          const mathResponse = await agent.invoke({
            messages: [{ role: "user", content: "stage all the changes in my /Users/amarssajjanshetty/workfolder5/projectV3" }],
          });

          // console.log(mathResponse.messages.slice(-1)[0].content);
          console.log(mathResponse)
          break;
        }
      default:
        console.log('Invalid action');
    }
  } catch (error) {
    console.error(error);
  }
}

main(process.argv);