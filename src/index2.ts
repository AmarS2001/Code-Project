import fsp from "fs/promises"
import Parser from "tree-sitter"
import { Chunk } from "./chunker/interfaces/chunk.interface";
import { LANGUAGE_PARSERS } from "./chunker/constants/chunk.constants";
import path from "path";

const MAX_CHUNK_SIZE = 10;

export async function chunkFile(filePath: string): Promise<Chunk[]> {
    try {
        const source = await fsp.readFile(filePath, "utf-8");
        const parser = new Parser();
        
        // Auto-detect language from extension
        const ext = path.extname(filePath).slice(1);
        const language = LANGUAGE_PARSERS[ext];
        if (!language) {
            throw new Error(`Unsupported file extension: ${ext}`);
        }
        
        parser.setLanguage(language as Parser.Language);
        const tree = parser.parse(source);
        
        const chunks: Chunk[] = [];
        
        function dfs(node: Parser.SyntaxNode): void {
            const text = node.text;
            const canChunk = text.length <= MAX_CHUNK_SIZE || node.childCount === 0;
            
            if (canChunk) {
                // Skip whitespace-only chunks
                if (text.trim().length === 0) return;
                
                chunks.push({
                    id: `${filePath}:${node.startPosition.row + 1}-${node.endPosition.row + 1}`,
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    code: text,
                    path: filePath,
                    comment: node.type,
                    error: node.hasError
                });
            } else {
                // Recurse into children
                for (const child of node.children) {
                    dfs(child);
                }
            }
        }
        
        dfs(tree.rootNode);
        return chunks;
    } catch (error) {
        console.log(error);
        return [];
    }
}


// Test function: Verifies no actual code is missing after chunking
export async function testChunking(filePath: string): Promise<boolean> {
    const source = await fsp.readFile(filePath, "utf-8");
    const chunks = await chunkFile(filePath);
    
    // Get all non-whitespace characters from source
    const sourceCode = source.replace(/\s/g, '');
    
    // Get all non-whitespace characters from chunks
    const chunkedCode = chunks.map(c => c.code).join('').replace(/\s/g, '');
    
    // Compare
    const missing = sourceCode.length - chunkedCode.length;
    
    console.log(`\n=== Chunking Test: ${path.basename(filePath)} ===`);
    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Source code chars (no whitespace): ${sourceCode.length}`);
    console.log(`Chunked code chars (no whitespace): ${chunkedCode.length}`);
    console.log(`Missing chars: ${missing}`);
    console.log(`Status: ${missing === 0 ? '✅ PASS' : '❌ FAIL'}`);
    
    return missing === 0;
}

// Run tests
(async () => {
    await testChunking("/Users/amarssajjanshetty/workfolder5/project/src/rough/test.py");
    // await testChunking("/Users/amarssajjanshetty/workfolder5/project/src/test/test.ts");
})();
