import { QdrantClient } from '@qdrant/js-client-rest';

async function main() {
  const client = new QdrantClient({ url: 'http://localhost:6333' });
  const collectionName = 'code_chunks';
  
  try {
    console.log("Fetching BaseService chunk to verify definitions...");
    
    const result = await client.scroll(collectionName, {
      limit: 50,
      with_payload: true,
    });
    
    result.points.forEach((p, i) => {
        const payload: any = p.payload || {};
        const content = payload.content || '';
        
        if (content.includes('abstract class BaseService')) {
             console.log(`\n--- BaseService Chunk (ID: ${payload.id}) ---`);
             console.log(`Definitions Metadata: ${JSON.stringify(payload.definitions)}`);
             console.log(`TOON Content:\n${payload.toon}`);
        }
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
