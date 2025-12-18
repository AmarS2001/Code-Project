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
      error: buffer.some(c => c.error),
    };
  }

  private getDefinitions(node: any): string[] {
    const definitions: string[] = [];
    
    // Helper to check a single node
    const checkNode = (n: any) => {
        if (n.type === 'class_declaration' || n.type === 'function_declaration' || n.type === 'interface_declaration' || n.type === 'method_definition') {
            const nameNode = n.childForFieldName('name');
            if (nameNode) {
                let defType = 'function';
                if (n.type === 'class_declaration') defType = 'class';
                if (n.type === 'interface_declaration') defType = 'interface';
                if (n.type === 'method_definition') defType = 'method';
                
                definitions.push(`${defType} ${nameNode.text}`);
            }
        }
    };

    // Check the node itself
    checkNode(node);

    // Check direct children (don't go too deep to avoid noise from nested functions)
    // We only want "top level" definitions for THIS chunk.
    if (node.children) {
        for (const child of node.children) {
            checkNode(child);
            // If the chunk is a program or block, we might want to look one level deeper?
            // For now, direct children should cover most top-level definitions in a file/block.
        }
    }
    
    return definitions;
  }

  private createChunkFromNode(node: Parser.SyntaxNode, lines: string[], contextPath: string[], filePath: string): Chunk {
    const content = node.text;
    const startLine = node.startPosition.row + 1;
    // const header = this.getHeader(node, lines); // Not used locally anymore

    // Get preceding comments
    const comments = this.getPrecedingComments(node);

    // Get context header from PARENT
    // If node is program, parent is null. 
    // If node is a top-level function, parent is program.
    // We want the signature of the *container*.
    const contextHeader = node.parent ? this.getHeader(node.parent, lines) : '';
    
    // Get definitions in this chunk
    const definitions = this.getDefinitions(node);

    return {
      id: this.generateId(content, filePath, startLine),
      content,
      file_path: filePath,
      language: 'unknown',
      start_line: startLine,
      end_line: node.endPosition.row + 1,
      path: contextPath,
      context_header: contextHeader,
      error: node.hasError,
      comments: comments,
      definitions: definitions,
      parent_type: node.parent ? node.parent.type : undefined
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
                id: this.generateId(buffer, filePath, nodeStartLine + startL),
                content: buffer,
                file_path: filePath,
                language: 'unknown',
                start_line: nodeStartLine + startL,
                end_line: nodeStartLine + i,
                context_header: this.getHeader(node, lines),
                path: contextPath,
                group_id: groupId,
                error: node.hasError,
                comments: i === 0 ? this.getPrecedingComments(node) : undefined, // Only first chunk gets comments
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
            error: node.hasError,
            comments: result.length === 0 ? this.getPrecedingComments(node) : undefined
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
    if (!node || node.type === 'program') return '';

    const startRow = node.startPosition.row;
    const endRow = node.endPosition.row;
    const totalLines = endRow - startRow + 1;
    
    // 1/4th of the content, capped at 50 lines
    const limit = Math.min(Math.ceil(totalLines * 0.25), 50);
    
    return lines.slice(startRow, startRow + limit).join('\n').trim();
  }

  private getPrecedingComments(node: Parser.SyntaxNode): string {
    let comments: string[] = [];
    let current = node.previousSibling;

    while (current) {
      if (current.type === 'comment' || current.type === 'block_comment') {
        comments.unshift(current.text);
        current = current.previousSibling;
      } else {
        break;
      }
    }
    
    return comments.join('\n');
  }

  private generateId(content: string, filePath: string, line: number): string {
    return createHash('sha256')
      .update(content + filePath + line.toString())
      .digest('hex')
      .substring(0, 12);
  }
}
