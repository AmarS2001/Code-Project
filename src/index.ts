import { Pipeline } from "./pipeline";
import { ScanService } from "./pipeline/ScanService";

async function main(args: string[]) {
  try{
    const action = args[2];
    switch(action){
      case 'scan':
        { const pipeline = Pipeline.createDefault();
        const scanner = new ScanService(pipeline);
        const result = await scanner.scan(args[3]);
        console.log('\n📊 Summary:');
        console.log(`   Total: ${result.stats.totalScanned} | Accepted: ${result.stats.totalAccepted} | Rejected: ${result.stats.totalRejected} | Duration: ${result.stats.duration}ms`);
        break; }
      default:
        console.log('Invalid action');
    }
  }catch(error){
    console.error(error);
  }
}

main(process.argv);