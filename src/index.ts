import { ChunkerManager } from "./chunker";
import { Pipeline } from "./pipeline";
import { ScanService } from "./pipeline/ScanService";

import { ChatOllama } from "@langchain/ollama"
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { HumanMessage, SystemMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { END, StateGraph, MessagesAnnotation } from "@langchain/langgraph";


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
              args: [
                "/Users/amarssajjanshetty/workfolder5/projectV3/dist/math-server.js",
              ],
            },
            filesystem: {
              transport: "stdio",
              command: "npx",
              args: [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "/Users/amarssajjanshetty/workfolder5/projectV3",
              ],
            },
            "mcp-local-rag": {
              "transport": "stdio",
              "command": "uvx",
              "args": [
                "--python=3.10",
                "--from",
                "git+https://github.com/nkapila6/mcp-local-rag",
                "mcp-local-rag"
              ]
            }
          });

          /* -------------------------------------
             2. LOAD TOOLS
          ------------------------------------- */
          const tools = await client.getTools();
          console.log(`\n🧰 Loaded ${tools.length} tools: ${tools.map(t => t.name).join(", ")}`);

          /* -------------------------------------
             3. LLM
          ------------------------------------- */
          const llm = new ChatOllama({
            model: "qwen2.5-coder:7b",
            temperature: 0,
            format: "json",
          }).bindTools(tools);

          /* -------------------------------------
             4. SYSTEM PROMPT
          ------------------------------------- */
          const systemPrompt = `You are a helpful assistant with access to various tools.
Your goal is to complete the user's request by intelligently choosing and executing the appropriate tools from the list available to you.

Produce a JSON response in the following format if you need to use a tool:
{
  "tool_calls": [
    {
      "name": "tool_name",
      "args": { "arg1": "value" }
    }
  ],
  "thought": "Brief explanation of your next step..."
}

If no further tools are needed and you have the final answer, provide your response in this format:
{
  "content": "Final answer or summary here",
  "thought": "Brief summary of what was accomplished..."
}

tools:
${tools.map(t => `  - ${t.name}: ${t.description}`).join("\n")}

RULES:
1. Examine the available tools and their descriptions to decide which one to use.
2. Provide arguments that match the tool's expected schema.
3. You can request multiple tool calls in one turn if they can be executed together, or one by one for sequential steps.
4. Do NOT assume the results of tool calls; wait for the tool output in the next turn if the steps depend on each other.`;

          /* -------------------------------------
             5. STATE TYPE (MEMORY)
          ------------------------------------- */
          type AgentState = {
            messages: BaseMessage[];
          };

          /* -------------------------------------
             6. PLANNER NODE
          ------------------------------------- */
          const plannerNode = async (state: typeof MessagesAnnotation.State) => {
            console.log("\n--- Planner Node ---");

            // Ollama requires tool message content to be a string
            const messages = state.messages.map(msg => {
              if (msg._getType() === "tool" && typeof msg.content !== "string") {
                return new ToolMessage({
                  tool_call_id: (msg as any).tool_call_id,
                  content: JSON.stringify(msg.content),
                  name: (msg as any).name,
                  additional_kwargs: msg.additional_kwargs,
                });
              }
              return msg;
            });

            const response = await llm.invoke(messages);

            let parsed;
            try {
              const contentStr = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
              parsed = JSON.parse(contentStr);
            } catch (e) {
              console.log("Response content is not JSON or failed to parse");
            }

            // Manually inject tool calls if the model returned them in JSON format
            if (parsed?.tool_calls) {
              (response as any).tool_calls = parsed.tool_calls.map((tc: any) => ({
                name: tc.name,
                args: tc.args || tc.arguments || {},
                id: tc.id || Math.random().toString(36).substring(7),
                type: 'tool_call'
              }));
              response.content = parsed.thought || "";
            } else if (parsed?.content) {
              response.content = parsed.content;
            }

            console.log("LLM Normalized Response:", JSON.stringify({
              content: response.content,
              tool_calls: response.tool_calls
            }, null, 2));

            if (response.tool_calls && response.tool_calls.length > 0) {
              response.tool_calls.forEach(tc => {
                console.log(`🛠️ LLM requested tool: ${tc.name} with args: ${JSON.stringify(tc.args)} `);
              });
            } else {
              console.log(`📝 LLM response: ${response.content} `);
            }

            return {
              messages: [response],
            };
          };

          /* -------------------------------------
             7. TOOL NODE (AUTO EXECUTION)
          ------------------------------------- */
          const toolNode = new ToolNode(tools);

          /* -------------------------------------
             8. ROUTING LOGIC
          ------------------------------------- */
          const shouldContinue = (state: typeof MessagesAnnotation.State) => {
            const last = state.messages.at(-1) as any;

            console.log(`\n-- - Routing Decision-- - `);
            const toolCalls = last?.tool_calls || last?.additional_kwargs?.tool_calls;

            if (toolCalls && toolCalls.length > 0) {
              console.log(`Routing to: tools(found ${toolCalls.length} tool calls)`);
              return "tools";
            }

            console.log("Routing to: END");
            return END;
          };

          /* -------------------------------------
             9. BUILD GRAPH
          ------------------------------------- */
          const graph = new StateGraph(MessagesAnnotation)
            .addNode("planner", plannerNode)
            .addNode("tools", toolNode)
            .setEntryPoint("planner")
            .addConditionalEdges("planner", shouldContinue, {
              tools: "tools",
              [END]: END,
            })
            .addEdge("tools", "planner");

          /* -------------------------------------
             10. COMPILE
          ------------------------------------- */
          const app = graph.compile();

          /* -------------------------------------
             11. RUN
          ------------------------------------- */
          const finalState = await app.invoke({
            messages: [
              new SystemMessage(systemPrompt),
              new HumanMessage(
                "Solve this problem 2 + 3 and web search for the current date and write both the result and the current date into file path /Users/amarssajjanshetty/workfolder5/projectV3/output.txt"
              ),
            ],
          });

          console.log("\n--- Execution Finished ---");
          console.log("Full Message History:");
          finalState.messages.forEach((msg: any, i: number) => {
            const role = msg._getType();
            const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
            console.log(`[${i}] ${role.toUpperCase()}: ${content.slice(0, 200)}${content.length > 200 ? '...' : ''} `);
            if (msg.tool_calls?.length) {
              console.log(`    Tool Calls: ${JSON.stringify(msg.tool_calls)} `);
            }
            if (msg.additional_kwargs?.tool_calls?.length) {
              console.log(`    Additional Kwargs Tool Calls: ${JSON.stringify(msg.additional_kwargs.tool_calls)} `);
            }
          });

          console.log("\n✅ Task completed");

        }
        break;
      default:
        console.log('Invalid action');
    }
  } catch (error) {
    console.error(error);
  }
}

main(process.argv);