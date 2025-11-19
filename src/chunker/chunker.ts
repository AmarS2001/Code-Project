import Parser from "tree-sitter";
import { logger } from "../logger/logger";
import { Chunk } from "./interfaces/chunk.interface";
import {
  IDENTIFIER_TYPES_SET,
  LANGUAGE_PARSERS,
  LANGUAGE_SIZE_LIMITS,
} from "./constants/chunk.constants";

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Extract code substring from source using node's byte indexes
 */
function sliceCode(source: string, node: Parser.SyntaxNode): string {
  return source.substring(node.startIndex, node.endIndex);
}

/**
 * Extract all comments from AST node and its descendants
 * Works for any Tree-sitter grammar by detecting comment nodes generically
 */
function extractComments(node: Parser.SyntaxNode, source: string): string {
  const comments: string[] = [];

  function collectComments(n: Parser.SyntaxNode): void {
    // Check if this node is a comment
    if (n.type === "comment" || n.type.toLowerCase().includes("comment")) {
      comments.push(sliceCode(source, n));
    }

    // Recursively check children
    for (let i = 0; i < n.childCount; i++) {
      collectComments(n.child(i)!);
    }
  }

  collectComments(node);
  return comments.join("\n").trim();
}

/**
 * Extract meaningful name from an AST node for path building
 * Works generically across Tree-sitter grammars by looking for identifier nodes
 */
function extractNodeName(node: Parser.SyntaxNode): string {
  // Look for identifier nodes in immediate children
  for (const child of node.children) {
    if (IDENTIFIER_TYPES_SET.has(child.type)) {
      return child.text;
    }
  }

  // Fallback: look for any child that looks like an identifier (contains letters/numbers)
  for (const child of node.children) {
    if (child.text && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(child.text)) {
      return child.text;
    }
  }

  // Last fallback: use node type
  return node.type;
}

/**
 * Build stable, deterministic ID for a chunk
 * Format: <fileName>_<node.type>_<startLine>_<endLine>
 */
function buildId(fileName: string, node: Parser.SyntaxNode): string {
  const startLine = node.startPosition.row + 1;
  const endLine = node.endPosition.row + 1;

  // Remove file extension and sanitize filename for ID
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "_");

  return `${baseName}_${node.type}_${startLine}_${endLine}`;
}

/**
 * Check if node has syntax errors (either this node or any descendant)
 */
function hasErrors(node: Parser.SyntaxNode): boolean {
  if (node.hasError || node.type === "ERROR") {
    return true;
  }

  // Check descendants
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && hasErrors(child)) {
      return true;
    }
  }

  return false;
}

/**
 * Recursively split AST node with backtracking for optimal chunking
 * Uses DFS with backtracking to ensure complete code coverage
 * 
 * Strategy:
 * 1. If node is in TARGET range (minSize=150 to 70% of maxSize): emit it, don't recurse
 * 2. If node is between target and maxSize: try children first, backtrack if needed
 * 3. If node > maxSize: try children first, backtrack if needed (emit oversized chunk)
 * 4. If node < minSize with children: skip it, let ancestor include it
 * 5. Leaf nodes: only emit if >= minSize (skip tiny tokens)
 * 
 * Backtracking ensures:
 * - Complete coverage (no code lost)
 * - Bigger chunks (target = 70% of maxSize, e.g. 1050 chars for TypeScript)
 * - Avoids tiny chunks (minSize=150 filtering)
 * - Starts from root and works down (DFS with size-based decisions)
 */
function splitNode(params: {
  source: string;
  node: Parser.SyntaxNode;
  fileName: string;
  pathTrace: string;
  chunks: Chunk[];
  maxSize: number;
  minSize: number;
}): boolean {
  const { source, node, fileName, pathTrace, chunks, maxSize, minSize } = params;

  const nodeSize = node.endIndex - node.startIndex;
  const nodeId = buildId(fileName, node);
  const nodeName = extractNodeName(node);

  // Build current path by appending current node name
  const currentPath = pathTrace ? `${pathTrace} > ${nodeName}` : nodeName;

  // Case 1: Node is within TARGET size range (minSize <= nodeSize <= targetSize)
  // Target size is 70% of maxSize - preferred chunk size for bigger granularity
  // Emit this node as a chunk and STOP (don't recurse into children)
  const targetSize = Math.floor(maxSize * 0.7); // 70% of maxSize
  // For TypeScript (maxSize=1500): target = 1050 chars
  
  if (nodeSize >= minSize && nodeSize <= targetSize) {
    const chunk: Chunk = {
      id: nodeId,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      code: sliceCode(source, node),
      path: currentPath,
      comment: extractComments(node, source),
      error: hasErrors(node),
    };

    chunks.push(chunk);
    return true; // Successfully chunked
  }
  
  // Case 1.5: Node is between targetSize and maxSize (can fit but should try to break down)
  // Try to chunk children for better granularity, but if they fail, emit this node
  if (nodeSize > targetSize && nodeSize <= maxSize && node.namedChildCount > 0) {
    const chunksBeforeChildren = chunks.length;
    
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        splitNode({
          source,
          node: child,
          fileName,
          pathTrace: currentPath,
          chunks,
          maxSize,
          minSize,
        });
      }
    }
    
    // If children created chunks, use them; otherwise emit this node
    const childrenCreatedChunks = chunks.length > chunksBeforeChildren;
    
    if (!childrenCreatedChunks) {
      // No children worked - emit this node as-is
      const chunk: Chunk = {
        id: nodeId,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        code: sliceCode(source, node),
        path: currentPath,
        comment: extractComments(node, source),
        error: hasErrors(node),
      };

      chunks.push(chunk);
      return true;
    }
    
    return true; // Children handled it
  }

  // Case 2: Node is too large (> maxSize) - try to split into children
  if (nodeSize > maxSize && node.namedChildCount > 0) {
    // Try to chunk children first
    const chunksBeforeChildren = chunks.length;

    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        splitNode({
          source,
          node: child,
          fileName,
          pathTrace: currentPath,
          chunks,
          maxSize,
          minSize,
        });
      }
    }

    // BACKTRACKING: If no children created chunks, we must emit this oversized node
    // Otherwise we'd lose code
    const childrenCreatedChunks = chunks.length > chunksBeforeChildren;
    
    if (!childrenCreatedChunks) {
      // Can't break down further - emit oversized node to ensure coverage
      const chunk: Chunk = {
        id: nodeId,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        code: sliceCode(source, node),
        path: currentPath,
        comment: extractComments(node, source),
        error: hasErrors(node),
      };

      chunks.push(chunk);
      return true;
    }

    return true; // Children handled it
  }

  // Case 3: Node is too small (< minSize) but has children
  // Skip this node and let children be processed
  // Don't emit tiny parent nodes - let them be included in ancestor chunks
  if (nodeSize < minSize && node.namedChildCount > 0) {
    // Try to chunk children - don't emit parent even if children fail
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        splitNode({
          source,
          node: child,
          fileName,
          pathTrace: currentPath,
          chunks,
          maxSize,
          minSize,
        });
      }
    }
    
    // Don't emit parent - it's too small
    // Let ancestor handle it via backtracking
    return false;
  }

  // Case 4: Leaf node (no children)
  // Skip tiny leaf nodes - they'll be included in ancestor chunks
  // Only emit if meets minimum size or is oversized
  if (nodeSize >= minSize || nodeSize > maxSize) {
    const chunk: Chunk = {
      id: nodeId,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      code: sliceCode(source, node),
      path: currentPath,
      comment: extractComments(node, source),
      error: hasErrors(node),
    };

    chunks.push(chunk);
    return true;
  }

  // Leaf node is too small - skip it (will be included in ancestor)
  return false;
}

// assignSiblings function removed - now using path traces instead

// ===================================================================
// FALLBACK TEXT CHUNKER
// ===================================================================

/**
 * Fallback chunker for when Tree-sitter language is not available
 * Uses simple text-based chunking with overlap
 */
function fallbackTextChunker(
  source: string,
  fileName: string,
  maxSize: number
): Chunk[] {
  const chunks: Chunk[] = [];
  const overlap = Math.min(100, Math.floor(maxSize * 0.1)); // 10% overlap, max 100 chars

  let currentPos = 0;
  let chunkIndex = 0;

  while (currentPos < source.length) {
    const chunkEnd = Math.min(currentPos + maxSize, source.length);
    const chunkCode = source.substring(currentPos, chunkEnd);

    const startLine = source.substring(0, currentPos).split("\n").length;
    const endLine = source.substring(0, chunkEnd).split("\n").length;

    const chunk: Chunk = {
      id: `${fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_]/g, "_")}_text_${chunkIndex}`,
      startLine,
      endLine,
      code: chunkCode,
      path: `text_chunk_${chunkIndex}`,
      comment: "",
      error: false,
    };

    chunks.push(chunk);

    // Move position with overlap
    currentPos = chunkEnd - overlap;
    if (currentPos >= chunkEnd) {
      break; // Avoid infinite loop
    }
    chunkIndex++;
  }

  return chunks;
}

// ===================================================================
// MAIN CHUNKING FUNCTION
// ===================================================================

/**
 * Main chunking function - language-agnostic AST-based code chunker
 * Uses backtracking to intelligently combine small sibling nodes
 *
 * @param source - Source code string
 * @param fileName - Name of the file being chunked
 * @param language - Tree-sitter Language object (null/undefined for fallback)
 * @param maxSize - Maximum size in characters for each chunk
 * @param minSize - Minimum preferred size for chunks (default: 150 characters)
 * @returns Array of semantic chunks with optimal size distribution
 */
export function chunkCode(
  source: string,
  fileName: string,
  language: Parser.Language | null | undefined,
  maxSize: number,
  minSize: number = 150
): Chunk[] {
  try {
    // Case 1: No language available - use fallback
    if (!language) {
      logger.info(
        { message: "Using fallback text chunker", data: { fileName } },
        "chunkCode"
      );
      return fallbackTextChunker(source, fileName, maxSize);
    }

    // Case 2: Language available - use AST-based chunking with backtracking
    logger.info(
      { message: "Using AST-based chunker with backtracking", data: { fileName, maxSize, minSize } },
      "chunkCode"
    );

    const parser = new Parser();
    parser.setLanguage(language);

    const tree = parser.parse(source);
    const chunks: Chunk[] = [];

    // Start recursive splitting with backtracking from root
    splitNode({
      source,
      node: tree.rootNode,
      fileName,
      pathTrace: "",
      chunks,
      maxSize,
      minSize,
    });

    logger.info(
      { message: "Chunking completed", data: { fileName, chunkCount: chunks.length } },
      "chunkCode"
    );

    return chunks;
  } catch (error) {
    logger.error(
      {
        message: "Error in chunking, falling back to text chunker",
        data: { fileName },
      },
      "chunkCode",
      error
    );

    // Fallback on any error
    return fallbackTextChunker(source, fileName, maxSize);
  }
}

// ===================================================================
// LEGACY COMPATIBILITY (for existing code)
// ===================================================================

/**
 * Enhanced function that integrates with existing language detection system
 * Maps language strings to Tree-sitter Language objects and uses appropriate size limits
 */
export async function chunkFile(
  filePath: string,
  language: string
): Promise<Chunk[]> {
  const fs = await import("fs/promises");

  try {
    const source = await fs.readFile(filePath, "utf-8");
    const fileName = filePath.split("/").pop() || filePath;

    // Normalize language name to lowercase for consistent lookup
    const normalizedLanguage = language.toLowerCase();

    // Get Tree-sitter Language object from constants
    const treeSitterLanguage = LANGUAGE_PARSERS[normalizedLanguage] || null;

    // Get appropriate size limit for this language
    const maxSize =
      LANGUAGE_SIZE_LIMITS[normalizedLanguage] || LANGUAGE_SIZE_LIMITS.default;

    logger.info(
      {
        message: "Processing file with chunker",
        data: {
          filePath,
          detectedLanguage: language,
          normalizedLanguage,
          hasTreeSitterSupport: !!treeSitterLanguage,
          maxSize,
        },
      },
      "chunkFile"
    );

    return chunkCode(source, fileName, treeSitterLanguage, maxSize);
  } catch (error) {
    logger.error(
      { message: "Error in chunkFile", data: { filePath, language } },
      "chunkFile",
      error
    );
    return [];
  }
}

/**
 * Convenience function to chunk source code directly with language string
 * Maps language string to Tree-sitter Language object automatically
 */
export function chunkSourceCode(
  source: string,
  fileName: string,
  language: string,
  maxSize?: number,
  minSize?: number
): Chunk[] {
  // Normalize language name to lowercase for consistent lookup
  const normalizedLanguage = language.toLowerCase();

  // Get Tree-sitter Language object from constants
  const treeSitterLanguage = LANGUAGE_PARSERS[normalizedLanguage] || null;

  // Get appropriate size limit for this language (or use provided maxSize)
  const effectiveMaxSize =
    maxSize ||
    LANGUAGE_SIZE_LIMITS[normalizedLanguage] ||
    LANGUAGE_SIZE_LIMITS.default;

  const effectiveMinSize = minSize || 150;

  return chunkCode(source, fileName, treeSitterLanguage, effectiveMaxSize, effectiveMinSize);
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Check if a language is supported by Tree-sitter AST parsing
 */
export function isLanguageSupported(language: string): boolean {
  return language.toLowerCase() in LANGUAGE_PARSERS;
}

/**
 * Get list of all supported languages
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_PARSERS);
}

/**
 * Get the size limit for a specific language
 */
export function getLanguageSizeLimit(language: string): number {
  const normalizedLanguage = language.toLowerCase();
  return (
    LANGUAGE_SIZE_LIMITS[normalizedLanguage] || LANGUAGE_SIZE_LIMITS.default
  );
}

/**
 * Get language information including support status and size limit
 */
export function getLanguageInfo(language: string): {
  language: string;
  normalized: string;
  supported: boolean;
  sizeLimit: number;
} {
  const normalized = language.toLowerCase();
  return {
    language,
    normalized,
    supported: normalized in LANGUAGE_PARSERS,
    sizeLimit: LANGUAGE_SIZE_LIMITS[normalized] || LANGUAGE_SIZE_LIMITS.default,
  };
}
