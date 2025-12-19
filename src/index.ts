import { SemanticChunker } from "./chunker/chunker";
import { Pipeline } from "./pipeline";
import { ScanService } from "./pipeline/ScanService";

async function main(args: string[]) {
  try{
    const action = args[2];
    switch(action){
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
          console.log(`Scanning files in ${targetPath}...`);
          
          // 1. Scan for files first
          const pipeline = Pipeline.createDefault();
          const scanner = new ScanService(pipeline);
          const scanResult = await scanner.scan(targetPath);
          
          if (scanResult.accepted.length === 0) {
            console.log('No files found to chunk.');
            break;
          }

          console.log(`Found ${scanResult.accepted.length} files. Starting chunking...`);

          const chunker = new SemanticChunker();
          let totalChunks = 0;
          let filesChunked = 0;
          const startTime = Date.now();
          const fs = await import('fs/promises');

          // 2. Chunk each file
          for (const filePath of scanResult.accepted) {
            try {
              const content = await fs.readFile(filePath, 'utf-8');
              const chunks = await chunker.chunk(filePath, content);

              console.log(chunks);
              totalChunks += chunks.length;
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
      default:
        console.log('Invalid action');
    }
  }catch(error){
    console.error(error);
  }
}

main(process.argv);