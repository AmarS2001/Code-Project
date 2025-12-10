import Parser from 'tree-sitter';
import { Chunk, ChunkerConfig } from './types';
import { getLanguage } from './LanguageSupport';
import { createHash } from 'node:crypto';

export class GenericChunker {
  private config: ChunkerConfig;
  private parser: Parser;

  constructor(config: ChunkerConfig) {
    this.parser = new Parser();
    this.config = config;
  }

  public async chunk(code: string, languageName: string, filePath: string): Promise<Chunk[]> {
    const lang = getLanguage(languageName);
    if (!lang) {
      throw new Error(`Language ${languageName} not supported`);
    }
    this.parser.setLanguage(lang);
    
    const tree = this.parser.parse(code);
    const rootNode = tree.rootNode;
    const lines = code.split('\n');

    // Initial atomic chunks from the tree
    let chunks = this.traverse(rootNode, [], lines, filePath);
    
    // Final merging pass at the top level to ensure we respect max size
    // (Though traversal usually handles bubbling up, the root list might need one last pass)
    chunks = this.mergeChunks(chunks);

    return chunks;
  }

  // Recursive DFS
  private traverse(node: Parser.SyntaxNode, contextPath: string[], lines: string[], filePath: string): Chunk[] {
    // 1. Validation: If node is too small (empty), ignore
    if (node.endIndex - node.startIndex === 0) return [];

    // Capture context: heuristic - simply the node type
    // In a generic system, we can't reliably guess "Class Name" without per-language rules.
    // However, we can grab the "Header" (first line) as context.
    const currentContextHeader = this.getHeader(node, lines);
    const newContextPath = [...contextPath, node.type]; // e.g. ["program", "class_declaration"]

    // 2. Traversal: Post-order
    let childChunks: Chunk[] = [];
    if (node.childCount > 0) {
      // Visit children
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (!child) continue;
        childChunks.push(...this.traverse(child, newContextPath, lines, filePath));
      }
    }

    // 3. Merging (Coalescing siblings)
    // We try to merge child chunks into larger blocks
    let mergedChildChunks = this.mergeChunks(childChunks);

    // 4. Decision: Should we wrap these children into THIS node's chunk?
    // Calculate total size of children
    const totalChildSize = mergedChildChunks.reduce((acc, c) => acc + c.content.length, 0);
    // Overhead = (node.end - node.start) - children size (approx, usually whitespace/brackets)
    // Actually, simple check: is the generic structure "Container"?
    
    // If the node itself fits in maxChunkSize, we prefer one single chunk for the whole node
    // instead of fragmented children.
    const nodeSize = node.endIndex - node.startIndex;
    
    if (nodeSize <= this.config.maxChunkSize) {
      // Create ONE chunk for this node
      return [this.createChunkFromNode(node, lines, contextPath, filePath)];
    }

    // If node is too big, we keep the merged children.
    // BUT! We also need to capture any text in *this* node that wasn't covered by children 
    // (e.g. "class Foo {" ... children ... "}")
    // For generic simplicity, we rely on the children covering the "meat".
    // The "Header" in the child chunks handles the context (e.g. "class Foo {")
    
    // Special Case: Big Leaf Node (e.g. huge string constant)
    if (mergedChildChunks.length === 0 && nodeSize > this.config.maxChunkSize) {
      return this.splitLargeNode(node, lines, contextPath, filePath);
    }
    
    // If we have children, we return them.
    // IMPORTANT: We need to inject THIS node's context into the children if we aren't wrapping them.
    // (Already done by passing `newContextPath` down)
    
    return mergedChildChunks;
  }

  private mergeChunks(chunks: Chunk[]): Chunk[] {
    const merged: Chunk[] = [];
    let currentBuffer: Chunk[] = [];
    let currentSize = 0;

    for (const chunk of chunks) {
      if (currentSize + chunk.content.length <= this.config.maxChunkSize) {
        currentBuffer.push(chunk);
        currentSize += chunk.content.length;
      } else {
        // Flush buffer
        if (currentBuffer.length > 0) {
          merged.push(this.finalizeBuffer(currentBuffer));
        }
        currentBuffer = [chunk];
        currentSize = chunk.content.length;
      }
    }
    if (currentBuffer.length > 0) {
      merged.push(this.finalizeBuffer(currentBuffer));
    }
    return merged;
  }

  private finalizeBuffer(buffer: Chunk[]): Chunk {
    if (buffer.length === 1) return buffer[0];

    // Combine chunks
    const first = buffer[0];
    const last = buffer[buffer.length - 1];
    
    const combinedContent = buffer.map(c => c.content).join('\n');
    
    // Inherit context from the first chunk (closest to start)
    return {
      ...first,
      content: combinedContent,
      end_line: last.end_line,
      // If we merged chunks, their IDs are now obsolete or we make a new one
      id: this.generateId(combinedContent, first.file_path, first.start_line),
    };
  }

  private createChunkFromNode(node: Parser.SyntaxNode, lines: string[], contextPath: string[], filePath: string): Chunk {
    const content = node.text;
    const startLine = node.startPosition.row + 1;
    const header = this.getHeader(node, lines);
    
    // Heuristic: If we are creating a chunk from a node, the "context" is the *parent's* context.
    // But `node.type` is potentially useful info. 
    // `contextPath` passed in matches the *parent*.
    
    // Use the *parent's* header context for this chunk? 
    // No, if this IS the chunk, it contains its own header.
    // The context *external* to this chunk is what matters for retrieval (breadcrumbs).
    // So context_header should come from the *parent* node if possible.
    // But in the recursion, we computed `contextPath` from parents.
    // We need the ACTUAL text header of the parent?
    // Let's stick effectively to "Signature" of current + Breadcrumbs of parent.
    
    return {
      id: this.generateId(content, filePath, startLine),
      content: content,
      file_path: filePath,
      language: 'unknown', // Set by caller or inferred
      start_line: startLine,
      end_line: node.endPosition.row + 1,
      path: contextPath,
      context_header: contextPath.length > 0 ? lines[Math.max(0, node.parent?.startPosition.row || 0)] : '', 
      // ^ Roughly the header of the parent
    };
  }

  private splitLargeNode(node: Parser.SyntaxNode, lines: string[], contextPath: string[], filePath: string): Chunk[] {
    // Forced line splitting
    const content = node.text;
    const nodeStartLine = node.startPosition.row + 1;
    const result: Chunk[] = [];
    
    // Group ID for this split
    const groupId = this.generateId(content, filePath, nodeStartLine);
    
    const nodeLines = content.split('\n');
    let buffer = '';
    let startL = 0;
    
    for (let i = 0; i < nodeLines.length; i++) {
        const line = nodeLines[i];
        if ((buffer.length + line.length) > this.config.maxChunkSize && buffer.length > 0) {
            // Flush
            result.push({
                id: this.generateId(buffer, filePath, nodeStartLine + startL),
                content: buffer,
                file_path: filePath,
                language: 'unknown',
                start_line: nodeStartLine + startL,
                end_line: nodeStartLine + i,
                context_header: this.getHeader(node, lines),
                path: contextPath,
                group_id: groupId
            });
            buffer = '';
            startL = i;
        }
        buffer += line + '\n';
    }
    if (buffer.length > 0) {
         result.push({
            id: this.generateId(buffer, filePath, nodeStartLine + startL),
            content: buffer,
            file_path: filePath,
            language: 'unknown',
            start_line: nodeStartLine + startL,
            end_line: nodeStartLine + nodeLines.length,
            context_header: this.getHeader(node, lines),
            path: contextPath,
            group_id: groupId,
        });
    }

    // Link them
    for(let i=0; i<result.length; i++) {
        if(i > 0) result[i].previous_chunk_id = result[i-1].id;
        if(i < result.length - 1) result[i].next_chunk_id = result[i+1].id;
    }

    return result;
  }

  private getHeader(node: Parser.SyntaxNode, lines: string[]): string {
    // Best effort: Return the first line of the node
    const startRow = node.startPosition.row;
    if (startRow < lines.length) {
      return lines[startRow].trim();
    }
    return '';
  }

  private generateId(content: string, filePath: string, line: number): string {
    return createHash('sha256')
      .update(content + filePath + line.toString())
      .digest('hex')
      .substring(0, 12);
  }
}
