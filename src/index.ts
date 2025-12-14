import { QdrantService } from './services/QdrantService';
import { GenericChunker } from './chunker/GenericChunker';
import { toTOON } from './chunker/types';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log("Usage: npm run dev -- <command> [options]");
    console.log("Commands:");
    console.log("  index <file_path>  Chuck and index a file");
    console.log("  query <text>       Search for code chunks");
    return;
  }

  const qdrant = new QdrantService();

  try {
    if (command === 'index') {
      const filePath = args[1];
      if (!filePath) {
        console.error("Error: Please provide a file path.");
        return;
      }
      
      const targetFile = path.resolve(process.cwd(), filePath);
      console.log(`Processing file: ${targetFile}`);

      const code = await fs.readFile(targetFile, 'utf-8');
      
      const chunker = new GenericChunker({
        maxChunkSize: 1000,
        minChunkSize: 50,
        overlap: 0
      });

      const chunks = await chunker.chunk(code, 'typescript', targetFile); // Should infer lang in real app
      console.log(`Generated ${chunks.length} chunks.`);

      console.log("Resetting collection...");
      await qdrant.resetCollection();

      console.log("Indexing...");
      console.log(chunks);
      await qdrant.indexChunks(chunks);
      console.log("Done.");

    } else if (command === 'query') {
      const queryText = args.slice(1).join(' '); // Allow query to be multiple words
      if (!queryText) {
        console.error("Error: Please provide a query.");
        return;
      }

      console.log(`Querying: "${queryText}"`);
      
      let results;
      const isErrorQuery = /error|bug|fix|issue|problem/i.test(queryText);

      if (isErrorQuery) {
        console.log("Detected error-related query. Performing hybrid search...");
        // 1. Semantic search
        const semanticResults = await qdrant.retrieve(queryText, 5);
        
        // 2. Explicit Error Filter search
        const errorFilter = {
            must: [
                {
                    key: "error",
                    match: {
                        value: true
                    }
                }
            ]
        };
        const errorResults = await qdrant.retrieve(queryText, 5, errorFilter);
        
        // Merge: Error results first, then semantic (deduplicated)
        const semanticIds = new Set(semanticResults.map(r => r.id));
        const uniqueErrorResults = errorResults.filter(r => !semanticIds.has(r.id));
        
        results = [...uniqueErrorResults, ...semanticResults];
        console.log(`Merged ${uniqueErrorResults.length} explicit error chunks with ${semanticResults.length} semantic chunks.`);
      } else {
        results = await qdrant.retrieve(queryText, 5);
      }

      console.log(`Found ${results.length} results:`);
      results.forEach((res, i) => {
        console.log(`\n[Result ${i + 1}] Score: ${res.score}`);
        console.log(`File: ${res.file_path}`);
        console.log(`Context: ${res.context_header}`);
        console.log(`Comments: ${res.comments || ''}`);
        // Highlight if it's an error chunk
        if (res.error) console.log(`[!!!] CONTAINS SYNTAX ERROR`);
        console.log(`Content:\n${res.content.substring(0, 200)}...`);
      });

    } else {
      console.error(`Unknown command: ${command}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
