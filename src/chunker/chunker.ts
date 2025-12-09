import Parser from "tree-sitter";
import { logger } from "../logger/logger";
import { Chunk, ChunkQuality } from "./interfaces/chunk.interface";
import { getLanguageConfig } from "./constants/chunk.constants";

export class CodeChunker {
  private defaultMaxChunkSize: number;
  private defaultMinChunkSize: number;
  
  constructor(defaultMaxChunkSize: number = 1500, defaultMinChunkSize: number = 60) {
    this.defaultMaxChunkSize = defaultMaxChunkSize;
    this.defaultMinChunkSize = defaultMinChunkSize;
  }

  async chunkFile(filePath: string, language?: string): Promise<Chunk[]> {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      
      const source = await fs.readFile(filePath, "utf-8");
      const ext = path.extname(filePath).slice(1);
      
      // Auto-detect language from extension if not provided
      const detectedLang = language || ext;
      
      return this.chunkSourceCode(source, filePath, detectedLang);
    } catch (error) {
      logger.error(
        { message: "Error reading file", data: { filePath } },
        "chunkFile",
        error
      );
      return [];
    }
  }

  chunkSourceCode(source: string, filePath: string, language: string): Chunk[] {
    try {
      const config = getLanguageConfig(language);
      
      if (!config.parser) {
        logger.info(
          { message: "Language not supported, using fallback", data: { language, filePath } },
          "chunkSourceCode"
        );
        return this.fallbackTextChunker(source, filePath, config.maxSize);
      }
      
      logger.info(
        { 
          message: "Chunking with AST", 
          data: { language, filePath, minSize: config.minSize, maxSize: config.maxSize } 
        },
        "chunkSourceCode"
      );
      
      return this.chunkWithAST(
        source, 
        filePath, 
        config.parser as Parser.Language, 
        config.minSize,
        config.maxSize
      );
    } catch (error) {
      logger.error(
        { message: "Error in chunking, falling back", data: { filePath } },
        "chunkSourceCode",
        error
      );
      const config = getLanguageConfig(language);
      return this.fallbackTextChunker(source, filePath, config.maxSize);
    }
  }

  private chunkWithAST(
    source: string,
    filePath: string,
    language: Parser.Language,
    minSize: number,
    maxSize: number
  ): Chunk[] {
    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(source);
    
    const chunks: Chunk[] = [];
    
    const dfs = (node: Parser.SyntaxNode): void => {
      const text = node.text;
      const textLength = text.length;
      const isLeaf = node.childCount === 0;
      
      // Can we chunk this node?
      const canChunk = 
        (textLength <= maxSize && textLength >= minSize) ||
        (isLeaf && text.trim().length > 0);
      
      if (canChunk) {
        if (text.trim().length === 0) return;
        
        chunks.push({
          id: `${filePath}:${node.startPosition.row + 1}-${node.endPosition.row + 1}`,
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1,
          code: text,
          path: filePath,
          nodeType: node.type,
          comment: this.extractComment(node),
          error: node.hasError
        });
      } else {
        // Process children and merge siblings
        const childrenStartIdx = chunks.length;
        
        for (const child of node.children) {
          dfs(child);
        }
        
        // Merge small consecutive siblings
        const childChunks = chunks.slice(childrenStartIdx);
        if (childChunks.length > 1) {
          const merged = this.mergeSiblings(childChunks, node, filePath, minSize, maxSize);
          chunks.splice(childrenStartIdx, childChunks.length, ...merged);
        }
      }
    };
    
    dfs(tree.rootNode);
    return chunks;
  }

  /**
   * Extract actual code comments from a node
   */
  private extractComment(node: Parser.SyntaxNode): string {
    const comments: string[] = [];
    
    for (const child of node.children) {
      if (child.type === 'comment') {
        comments.push(child.text.trim());
      }
    }
    
    return comments.join(' ');
  }

  private mergeSiblings(
    siblings: Chunk[], 
    parent: Parser.SyntaxNode, 
    filePath: string,
    minSize: number,
    maxSize: number
  ): Chunk[] {
    const merged: Chunk[] = [];
    let currentGroup: Chunk[] = [];
    
    for (const chunk of siblings) {
      const groupSize = currentGroup.reduce((sum, c) => sum + c.code.length, 0);
      const combinedSize = groupSize + chunk.code.length;
      
      const shouldMerge = 
        currentGroup.length === 0 ||
        (groupSize < minSize) || 
        (chunk.code.length < minSize && combinedSize <= maxSize);
      
      if (shouldMerge) {
        currentGroup.push(chunk);
      } else {
        merged.push(this.mergeGroup(currentGroup, parent, filePath));
        currentGroup = [chunk];
      }
    }
    
    if (currentGroup.length > 0) {
      merged.push(this.mergeGroup(currentGroup, parent, filePath));
    }
    
    return merged;
  }

  private mergeGroup(group: Chunk[], parent: Parser.SyntaxNode, filePath: string): Chunk {
    if (group.length === 1) return group[0];
    
    const parentType = parent.type;
    const childCount = group.length;
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

  /**
   * Fallback text-based chunker for unsupported languages
   */
  private fallbackTextChunker(source: string, filePath: string, maxSize: number): Chunk[] {
    const chunks: Chunk[] = [];
    const overlap = Math.min(100, Math.floor(maxSize * 0.1));
    
    let currentPos = 0;
    let chunkIndex = 0;
    
    while (currentPos < source.length) {
      const chunkEnd = Math.min(currentPos + maxSize, source.length);
      const chunkCode = source.substring(currentPos, chunkEnd);
      
      const startLine = source.substring(0, currentPos).split("\n").length;
      const endLine = source.substring(0, chunkEnd).split("\n").length;
      
      chunks.push({
        id: `${filePath}_text_${chunkIndex}`,
        startLine,
        endLine,
        code: chunkCode,
        path: filePath,
        nodeType: "text_chunk",
        comment: "",
        error: false
      });
      
      currentPos = chunkEnd - overlap;
      if (currentPos >= chunkEnd) break;
      chunkIndex++;
    }
    
    return chunks;
  }

  analyzeQuality(
    chunks: Chunk[], 
    source: string, 
    minSize?: number, 
    maxSize?: number
  ): ChunkQuality {
    const effectiveMinSize = minSize ?? this.defaultMinChunkSize;
    const effectiveMaxSize = maxSize ?? this.defaultMaxChunkSize;
    
    // Completeness check
    const sourceCode = source.replace(/\s/g, '');
    const chunkedCode = chunks.map(c => c.code).join('').replace(/\s/g, '');
    const missingChars = sourceCode.length - chunkedCode.length;
    
    // Size metrics
    const sizes = chunks.map(c => c.code.length);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length || 0;
    const actualMinSize = Math.min(...sizes);
    const actualMaxSize = Math.max(...sizes);
    
    const tinyChunks = sizes.filter(s => s < effectiveMinSize).length;
    const goodSizeChunks = sizes.filter(
      s => s >= effectiveMinSize && s <= effectiveMaxSize
    ).length;
    
    const tinyPercentage = (tinyChunks / chunks.length) * 100;
    const goodPercentage = (goodSizeChunks / chunks.length) * 100;
    
    // Quality assessment
    const isComplete = missingChars === 0;
    const isGoodQuality = tinyPercentage < 15 && avgSize >= 100;
    
    return {
      totalChunks: chunks.length,
      avgSize: Math.round(avgSize),
      minSize: actualMinSize,
      maxSize: actualMaxSize,
      tinyChunks,
      goodSizeChunks,
      tinyPercentage: parseFloat(tinyPercentage.toFixed(1)),
      goodPercentage: parseFloat(goodPercentage.toFixed(1)),
      isComplete,
      missingChars,
      isGoodQuality
    };
  }

  /**
   * Log quality metrics
   */
  logQuality(quality: ChunkQuality, fileName: string): void {
    logger.info(
      {
        message: "Chunk quality analysis",
        data: {
          fileName,
          totalChunks: quality.totalChunks,
          avgSize: quality.avgSize,
          sizeRange: `${quality.minSize}-${quality.maxSize}`,
          tinyChunks: `${quality.tinyChunks} (${quality.tinyPercentage}%)`,
          goodChunks: `${quality.goodSizeChunks} (${quality.goodPercentage}%)`,
          complete: quality.isComplete ? "✅" : `❌ (${quality.missingChars} chars missing)`,
          quality: quality.isGoodQuality ? "✅ GOOD" : "⚠️ NEEDS IMPROVEMENT"
        }
      },
      "analyzeQuality"
    );
  }
}
