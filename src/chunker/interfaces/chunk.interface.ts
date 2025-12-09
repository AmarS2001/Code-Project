export interface Chunk {
    id: string;
    startLine: number;
    endLine: number;
    code: string;
    path: string;
    nodeType: string;      // AST node type (e.g., 'function_definition', 'module_children(18)')
    comment: string;       // Actual code comments extracted from source
    error: boolean;
}

export interface ChunkQuality {
    totalChunks: number;
    avgSize: number;
    minSize: number;
    maxSize: number;
    tinyChunks: number;
    goodSizeChunks: number;
    tinyPercentage: number;
    goodPercentage: number;
    isComplete: boolean;
    missingChars: number;
    isGoodQuality: boolean;
  }