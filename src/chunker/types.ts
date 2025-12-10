export interface Chunk {
  id: string;
  content: string;
  file_path: string;
  language: string;
  start_line: number;
  end_line: number;
  
  // Contextual information
  context_header: string; // The signature of the parent container (e.g. "class User {")
  path: string[]; // Breadcrumbs e.g. ["class User", "method login"]
  
  // Grouping information for large nodes split into multiple chunks
  group_id?: string; // ID shared by all chunks from the same large node
  previous_chunk_id?: string;
  next_chunk_id?: string;
  
  // Original parent type (e.g. "class_declaration") to help retrieval filtering
  parent_type?: string; 
}

export interface ChunkerConfig {
  maxChunkSize: number; // in characters or tokens (approx)
  minChunkSize: number;
  overlap?: number; 
  // Heuristic for "header" lines (lines to capture from parent)
  contextLines?: number; 
}

import { encode as toToon } from '@toon-format/toon';

/**
 * Serialize a chunk to a Token Oriented Object Notation (TOON) string.
 */
export function toTOON(chunk: Chunk): string {
  // Map Chunk interface to a generic Object/Record for TOON
  // TOON likely accepts an object
  return toToon({
    CHUNK_ID: chunk.id,
    PATH: chunk.file_path,
    GROUP: chunk.group_id,
    BREADCRUMBS: chunk.path.length ? chunk.path.join(' > ') : undefined,
    CONTEXT: chunk.context_header,
    CONTENT: chunk.content
  });
}
