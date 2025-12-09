// @ts-nocheck

import fsp from "fs/promises"
import Parser from "tree-sitter"
import { Chunk } from "./chunker/interfaces/chunk.interface";
import { LANGUAGE_PARSERS } from "./chunker/constants/chunk.constants";
import path from "path";

const MAX_CHUNK_SIZE = 1500;  // Upper bound for chunk size
const MIN_CHUNK_SIZE = 60;    // Lower bound (merge smaller siblings)

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
        
        /**
         * Extract actual code comments from a node
         */
        function extractComment(node: Parser.SyntaxNode): string {
            // Look for comment nodes in children
            const comments: string[] = [];
            
            for (const child of node.children) {
                if (child.type === 'comment') {
                    comments.push(child.text.trim());
                }
            }
            
            return comments.join(' ');
        }
        
        function dfs(node: Parser.SyntaxNode): void {
            const text = node.text;
            const textLength = text.length;
            const isLeaf = node.childCount === 0;
            
            // Simple heuristic: Can we chunk this node?
            const canChunk = 
                (textLength <= MAX_CHUNK_SIZE && textLength >= MIN_CHUNK_SIZE) || // Good size
                (isLeaf && text.trim().length > 0); // Or it's a leaf (merge later)
            
            if (canChunk) {
                // Skip whitespace-only chunks
                if (text.trim().length === 0) return;
                
                chunks.push({
                    id: `${filePath}:${node.startPosition.row + 1}-${node.endPosition.row + 1}`,
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    code: text,
                    path: filePath,
                    nodeType: node.type,
                    comment: extractComment(node),
                    error: node.hasError
                });
            } else {
                // Too large - process children and merge siblings
                const childrenStartIdx = chunks.length;
                
                for (const child of node.children) {
                    dfs(child);
                }
                
                // Merge small consecutive siblings (they share parent context)
                const childChunks = chunks.slice(childrenStartIdx);
                if (childChunks.length > 1) {
                    const merged = mergeSiblings(childChunks, node);
                    chunks.splice(childrenStartIdx, childChunks.length, ...merged);
                }
            }
        }
        
        /**
         * Merge small sibling chunks that share parent context.
         * Siblings in AST are semantically related!
         */
        function mergeSiblings(siblings: Chunk[], parent: Parser.SyntaxNode): Chunk[] {
            const merged: Chunk[] = [];
            let currentGroup: Chunk[] = [];
            
            for (const chunk of siblings) {
                const groupSize = currentGroup.reduce((sum, c) => sum + c.code.length, 0);
                const combinedSize = groupSize + chunk.code.length;
                
                // Merge siblings if they're small and fit together
                const shouldMerge = 
                    currentGroup.length === 0 ||
                    (groupSize < MIN_CHUNK_SIZE) || 
                    (chunk.code.length < MIN_CHUNK_SIZE && combinedSize <= MAX_CHUNK_SIZE);
                
                if (shouldMerge) {
                    currentGroup.push(chunk);
                } else {
                    merged.push(mergeGroup(currentGroup, parent));
                    currentGroup = [chunk];
                }
            }
            
            if (currentGroup.length > 0) {
                merged.push(mergeGroup(currentGroup, parent));
            }
            
            return merged;
        }
        
        function mergeGroup(group: Chunk[], parent: Parser.SyntaxNode): Chunk {
            if (group.length === 1) return group[0];
            
            // Use parent node type for semantic context (LLM-friendly)
            const parentType = parent.type;
            const childCount = group.length;
            
            // Combine all comments from merged chunks
            const combinedComments = group
                .map(c => c.comment)
                .filter(c => c.length > 0)
                .join(' ');
            
            return {
                id: `${filePath}:${group[0].startLine}-${group[group.length - 1].endLine}`,
                startLine: group[0].startLine,
                endLine: group[group.length - 1].endLine,
                code: group.map(c => c.code).join(''),
                path: filePath,
                nodeType: `${parentType}_children(${childCount})`,
                comment: combinedComments,
                error: group.some(c => c.error)
            };
        }
        
        dfs(tree.rootNode);
        return chunks;
    } catch (error) {
        console.log(error);
        return [];
    }
}


// Test function: Verifies completeness and quality
export async function testChunking(filePath: string): Promise<boolean> {
    const source = await fsp.readFile(filePath, "utf-8");
    const chunks = await chunkFile(filePath);

    console.log({chunks})
    
    // Completeness check: no code missing
    const sourceCode = source.replace(/\s/g, '');
    const chunkedCode = chunks.map(c => c.code).join('').replace(/\s/g, '');
    const missing = sourceCode.length - chunkedCode.length;
    
    // Quality metrics
    const sizes = chunks.map(c => c.code.length);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length || 0;
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    const tinyChunks = sizes.filter(s => s < MIN_CHUNK_SIZE).length;
    const goodSizeChunks = sizes.filter(s => s >= MIN_CHUNK_SIZE && s <= MAX_CHUNK_SIZE).length;
    
    console.log(`\n=== Chunking Test: ${path.basename(filePath)} ===`);
    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Chunk sizes: min=${minSize}, avg=${Math.round(avgSize)}, max=${maxSize}`);
    console.log(`Size distribution:`);
    console.log(`  - Tiny (<${MIN_CHUNK_SIZE}): ${tinyChunks} (${(tinyChunks/chunks.length*100).toFixed(1)}%)`);
    console.log(`  - Good (${MIN_CHUNK_SIZE}-${MAX_CHUNK_SIZE}): ${goodSizeChunks} (${(goodSizeChunks/chunks.length*100).toFixed(1)}%)`);
    console.log(`Completeness: ${missing === 0 ? '✅ PASS' : '❌ FAIL'} (${missing} chars missing)`);
    
    // Quality: Low noise + reasonable avg size
    const isGoodQuality = tinyChunks < chunks.length * 0.15 && avgSize >= 100;
    console.log(`Quality: ${isGoodQuality ? '✅ GOOD for LLM/Indexing' : '⚠️  Consider adjusting size params'}`);
    
    return missing === 0;
}

// Run tests
(async () => {
    await testChunking("/Users/amarssajjanshetty/workfolder5/project/src/rough/test.py");
    await testChunking("/Users/amarssajjanshetty/workfolder5/project/src/test/test.ts");
})();
