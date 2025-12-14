import { QdrantClient } from '@qdrant/js-client-rest';

async function main() {
  const client = new QdrantClient({ url: 'http://localhost:6333' });
  const collectionName = 'code_chunks';
  
  try {
    console.log("Fetching chunks with errors to verify TOON content...");
    
    const filter = {
        must: [
            {
                key: "error",
                match: {
                    value: true
                }
            }
        ]
    };

    const result = await client.scroll(collectionName, {
      limit: 5,
      filter: filter,
      with_payload: true,
    });
    
    if (result.points.length === 0) {
        console.log("No chunks with errors found in database!");
        return;
    }

    result.points.forEach((p, i) => {
        const payload: any = p.payload || {};
        console.log(`\n--- Chunk ${i + 1} (ID: ${payload.id}) ---`);
        console.log(`Error Metadata: ${payload.error}`);
        console.log(`Stored TOON Content:\n${payload.toon}`);
        
        if (payload.toon && payload.toon.includes("CONTAINS SYNTAX ERROR !!!")) {
            console.log("\n✅ VERIFIED: TOON content contains error warning string.");
        } else {
            console.log("\n❌ FAILED: TOON content missing error warning string.");
        }
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
