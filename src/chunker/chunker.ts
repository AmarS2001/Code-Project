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
 * Extract all node type names from a Tree-sitter language
 * This makes the chunker language-agnostic by using the language's own node types
 */
function getNodeTypeNames(language: Parser.Language | null | undefined): Set<string> {
  if (!language) {
    return new Set();
  }

  try {
    // Access nodeTypeInfo from the language object
    // TypeScript doesn't expose this property, so we access it dynamically
    const nodeTypeInfo = (language as unknown as { nodeTypeInfo?: Array<{ type?: string; name?: string }> }).nodeTypeInfo;
    if (nodeTypeInfo && Array.isArray(nodeTypeInfo)) {
      // Extract all node type names
      return new Set(nodeTypeInfo.map((typeInfo) => typeInfo.type || typeInfo.name || "unknown"));
    }
  } catch (error) {
    logger.warn(
      { message: "Failed to extract node types from language", data: {} },
      "getNodeTypeNames",
      error instanceof Error ? error : undefined
    );
  }

  return new Set();
}

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
 * Check if a node represents a semantically significant code construct
 * This helps filter out tiny tokens and focus on meaningful chunks
 * Uses dynamic node types from the language parser for language-agnostic operation
 */
function isSignificantNode(node: Parser.SyntaxNode, languageNodeTypes: Set<string>): boolean {
  // Minimum size threshold - don't chunk tiny tokens
  const MIN_CHUNK_SIZE = 50; // characters
  const nodeSize = node.endIndex - node.startIndex;
  
  if (nodeSize < MIN_CHUNK_SIZE) {
    // Exception: allow small nodes if they match important semantic patterns
    // These patterns work across languages (e.g., function_definition, class_declaration, etc.)
    const importantPatterns = [
      "function", "method", "class", "interface", "type",
      "declaration", "definition", "statement",
      "import", "export", "variable", "assignment"
    ];
    
    // Check if node type contains any important pattern or is in the language's node types
    const hasImportantPattern = importantPatterns.some(pattern => 
      node.type.toLowerCase().includes(pattern)
    );
    
    if (!hasImportantPattern && !languageNodeTypes.has(node.type)) {
      return false;
    }
  }

  // Semantic significance based on node type patterns
  // These patterns work across different programming languages
  const significantPatterns = [
    "function", "method", "class", "interface", "struct", "trait", "enum",
    "module", "namespace", "package",
    "declaration", "definition", "statement",
    "import", "export", "variable", "assignment",
    "comment", "documentation",
    "program", "source_file"
  ];

  // Check if node type is in the language's node types (language-specific validation)
  const isLanguageNodeType = languageNodeTypes.size === 0 || languageNodeTypes.has(node.type);
  
  // Check if node type matches significant patterns (cross-language patterns)
  const matchesPattern = significantPatterns.some(pattern => 
    node.type.toLowerCase().includes(pattern)
  );

  return isLanguageNodeType && matchesPattern;
}

/**
 * Recursively split AST node based on size rules with path tracing
 */
function splitNode(params: {
  source: string;
  node: Parser.SyntaxNode;
  fileName: string;
  pathTrace: string;
  chunks: Chunk[];
  maxSize: number;
  languageNodeTypes: Set<string>;
}): void {
  const { source, node, fileName, pathTrace, chunks, maxSize, languageNodeTypes } = params;

  const nodeSize = node.endIndex - node.startIndex;
  const nodeId = buildId(fileName, node);
  const nodeName = extractNodeName(node);

  // Build current path by appending current node name
  const currentPath = pathTrace ? `${pathTrace} > ${nodeName}` : nodeName;

  // Check if this node is semantically significant
  const isSignificant = isSignificantNode(node, languageNodeTypes);

  // Emit chunk if: (size <= maxSize OR no named children) AND node is significant
  if ((nodeSize <= maxSize || node.namedChildCount === 0) && isSignificant) {
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
    return;
  }

  // If node is too large or not significant enough, recursively split named children
  if (node.namedChildCount > 0) {
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
          languageNodeTypes,
        });
      }
    }
  } else if (isSignificant) {
    // Leaf node that's significant - emit it even if it was skipped above
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
  }
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
 *
 * @param source - Source code string
 * @param fileName - Name of the file being chunked
 * @param language - Tree-sitter Language object (null/undefined for fallback)
 * @param maxSize - Maximum size in characters for each chunk
 * @returns Array of semantic chunks
 */
export function chunkCode(
  source: string,
  fileName: string,
  language: Parser.Language | null | undefined,
  maxSize: number
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

    // Case 2: Language available - use AST-based chunking
    logger.info(
      { message: "Using AST-based chunker", data: { fileName } },
      "chunkCode"
    );

    // Extract node types from the language for language-agnostic operation
    const languageNodeTypes = getNodeTypeNames(language);
    logger.debug(
      { 
        message: "Extracted node types from language", 
        data: { fileName, nodeTypeCount: languageNodeTypes.size } 
      },
      "chunkCode"
    );

    const parser = new Parser();
    parser.setLanguage(language);

    const tree = parser.parse(source);
    const chunks: Chunk[] = [];

    // Start recursive splitting from root
    splitNode({
      source,
      node: tree.rootNode,
      fileName,
      pathTrace: "",
      chunks,
      maxSize,
      languageNodeTypes,
    });

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
  maxSize?: number
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

  return chunkCode(source, fileName, treeSitterLanguage, effectiveMaxSize);
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
