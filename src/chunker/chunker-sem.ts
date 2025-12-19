import { Parser, Node as SyntaxNode } from 'web-tree-sitter';
import { getLanguageFromExtPromise } from './language-loader';

// Helper for unique IDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface Chunk {
  uuid: string;

  // Location
  filePath: string;
  startLine: number;
  endLine: number;

  // Code
  code: string;
  parentCode?: string;

  // Structure
  breadcrumb?: string[]; 

  error?: string[]; 
  
  previousChunkSnippet?: string;
  nextChunkSnippet?: string;
}

export class SemanticChunker {
  private parser: Parser | null = null;
  private maxChunkSize: number;

  constructor(maxChunkSize: number = 1500) {
    this.maxChunkSize = maxChunkSize;
  }

  async init() {
    await Parser.init();
    this.parser = new Parser();
  }

  async chunk(filePath: string, code: string): Promise<Chunk[]> {
    if (!this.parser) {
      await this.init();
    }

    const ext = filePath.split('.').pop()?.toLowerCase();
    if (!ext || !getLanguageFromExtPromise[ext]) {
        console.warn(`No language parser found for extension: ${ext}`);
        // Fallback or just return empty. Returning empty as per generic requirement expectation (needs tree-sitter)
        return [];
    }

    const lang = await getLanguageFromExtPromise[ext]();
    if (!lang) {
        return [];
    }
    this.parser!.setLanguage(lang);
    
    const tree = this.parser!.parse(code);
    if (!tree) {
      return [];
    }
    const chunks: Chunk[] = [];

    // Traverse
    this.traverse(tree.rootNode, filePath, code, [], chunks);

    tree.delete();

    // Enrich with snippets for navigation
    for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
            const prevLines = chunks[i-1].code.split('\n');
            // Capture last 5 lines of previous chunk
            chunks[i].previousChunkSnippet = prevLines.slice(-10).join('\n');
        }
        if (i < chunks.length - 1) {
            const nextLines = chunks[i+1].code.split('\n');
            // Capture first 5 lines of next chunk
            chunks[i].nextChunkSnippet = nextLines.slice(0, 10).join('\n');
        }
    }

    return chunks;
  }

  private traverse(node: SyntaxNode, filePath: string, fullCode: string, breadcrumb: string[], chunks: Chunk[]) {
    const children = node.children;
    
    // Base case: No children (leaf) or forced chunking of large leaf needed?
    // If it's a leaf, we can't recurse. We must accept it.
    if (children.length === 0) {
        this.emitChunk(node, filePath, fullCode, breadcrumb, chunks);
        return;
    }

    let accumulator: SyntaxNode[] = [];
    let currentSize = 0;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childSize = child.text.length;

        // Decision: Split (Recurse) or Merge (Accumulate)
        // We split if the child is bigger than maxChunkSize
        if (childSize > this.maxChunkSize) {
            // 1. Flush existing accumulator
            if (accumulator.length > 0) {
                this.flushAccumulator(accumulator, filePath, fullCode, breadcrumb, chunks, node);
                accumulator = [];
                currentSize = 0;
            }
            
            // 2. Recurse into the large child
            const newBreadcrumb = [...breadcrumb];
            const identifierText = this.getIdentifierText(child);
            if (identifierText) {
                newBreadcrumb.push(identifierText);
            }
            
            this.traverse(child, filePath, fullCode, newBreadcrumb, chunks);
        } else {
            // Child fits in a chunk (individually).
            // Try to add to accumulator.
            // If adding makes accumulator too big, flush first.
            if (currentSize + childSize > this.maxChunkSize && accumulator.length > 0) {
                 this.flushAccumulator(accumulator, filePath, fullCode, breadcrumb, chunks, node);
                 accumulator = [];
                 currentSize = 0;
            }
            
            accumulator.push(child);
            currentSize += childSize;
        }
    }
    
    // Final flush of any remaining siblings
    if (accumulator.length > 0) {
        this.flushAccumulator(accumulator, filePath, fullCode, breadcrumb, chunks, node);
    }
  }

  private flushAccumulator(nodes: SyntaxNode[], filePath: string, fullCode: string, breadcrumb: string[], chunks: Chunk[], parentNode: SyntaxNode) {
    if (nodes.length === 0) return;
    
    const startNode = nodes[0];
    const endNode = nodes[nodes.length - 1];
    
    const startLine = startNode.startPosition.row + 1; // 1-based
    const endLine = endNode.endPosition.row + 1;
    
    // Use startIndex and endIndex for precise code extraction
    const startIndex = startNode.startIndex;
    const endIndex = endNode.endIndex;
    
    const chunkCode = fullCode.substring(startIndex, endIndex);
    
    // Check for errors in these nodes
    const errorDetails: string[] = [];
    for (const n of nodes) {
        if (n.hasError) {
            const errorNodes = this.findAllErrorNodes(n);
            if (errorNodes.length > 0) {
                for (const errorNode of errorNodes) {
                    const errLine = errorNode.startPosition.row + 1;
                    const errCode = errorNode.text.substring(0, 100).replace(/\n/g, ' '); 
                    errorDetails.push(`error: Has error at line number ${errLine} at node or ${errCode}`);
                }
            } else {
                // Fallback if specific node not found but hasError is true
                 const errLine = n.startPosition.row + 1;
                 const errCode = chunkCode.substring(0, 50).replace(/\n/g, ' ');
                 errorDetails.push(`error: Has error at line number ${errLine} at node or ${errCode}`);
            }
        }
    }

    const chunk: Chunk = {
        uuid: uuidv4(),
        filePath,
        startLine,
        endLine,
        code: chunkCode,
        parentCode: this.getParentContext(parentNode),
        breadcrumb,
    };
    
    if (errorDetails.length > 0) {
        // Deduplicate strings just in case
        chunk.error = Array.from(new Set(errorDetails));
    }
    
    chunks.push(chunk);
  }

  private findAllErrorNodes(node: SyntaxNode): SyntaxNode[] {
    const errors: SyntaxNode[] = [];
    if (node.type === 'ERROR' || node.type === 'MISSING') {
        errors.push(node);
    }
    
    if (node.hasError) {
        for (const child of node.children) {
            if (child.hasError || child.type === 'ERROR' || child.type === 'MISSING') {
                errors.push(...this.findAllErrorNodes(child));
            }
        }
    }
    return errors;
  }
  
  private emitChunk(node: SyntaxNode, filePath: string, fullCode: string, breadcrumb: string[], chunks: Chunk[]) {
      this.flushAccumulator([node], filePath, fullCode, breadcrumb, chunks, node.parent || node);
  }

  private getParentContext(node: SyntaxNode): string {
      // Just return the first few lines of the parent to give context
      const lines = node.text.split('\n');
      return lines.slice(0, 5).join('\n');
  }

  private getIdentifierText(node: SyntaxNode): string | null {
      // Heuristic: Look for a child named 'name' or of type 'identifier'
      const nameNode = node.childForFieldName('name');
      if (nameNode) return nameNode.text;
      
      for (const child of node.children) {
          if (child.type === 'identifier' || child.type === 'type_identifier' || child.type === 'name') {
              return child.text;
          }
      }
      return null;
  }
}
