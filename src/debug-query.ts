import { QdrantService } from './services/QdrantService';

async function main() {
  const qdrant = new QdrantService();
  const query = "Get me the implementation of BaseService";
  
  console.log(`Querying: "${query}" (Limit 20)`);
  
  try {
    const results = await qdrant.retrieve(query, 20);
    
    console.log(`Found ${results.length} results.`);
    
    let baseServiceRank = -1;
    
    results.forEach((res, i) => {
        const contentPreview = res.content.substring(0, 40).replace(/\n/g, ' ');
        const isBaseService = res.content.includes('class BaseService');
        
        console.log(`[${i+1}] Score: ${res.score.toFixed(4)} | ID: ${res.id} | ${contentPreview}...`);
        
        if (isBaseService) {
            baseServiceRank = i + 1;
            console.log(`    >>> TARGET FOUND HERE (BaseService) <<<`);
        }
    });
    
    if (baseServiceRank === -1) {
        console.log("\n❌ Target 'BaseService' NOT found in top 20.");
    } else {
        console.log(`\n✅ Target 'BaseService' found at rank ${baseServiceRank}.`);
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
