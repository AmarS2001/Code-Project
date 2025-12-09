// Import tree-sitter language parsers
import JavaScript from "tree-sitter-javascript";
// tree-sitter-typescript exports an object with typescript and tsx properties
import TypeScriptModule from "tree-sitter-typescript";
import Python from "tree-sitter-python";
import Java from "tree-sitter-java";
import Cpp from "tree-sitter-cpp";
import Go from "tree-sitter-go";
import Rust from "tree-sitter-rust";
import Ruby from "tree-sitter-ruby";
import PHP from "tree-sitter-php";
import Kotlin from "tree-sitter-kotlin";
// @ts-expect-error - tree-sitter-css has different export structure
import CSS from "tree-sitter-css";
import SCSS from "tree-sitter-scss";
import HTML from "tree-sitter-html";
import JSON from "tree-sitter-json";
import YAML from "tree-sitter-yaml";
import Markdown from "tree-sitter-markdown";
import SQL from "tree-sitter-sql";

/**
 * Language configuration interface
 * Maps each language to its parser, min chunk size, and max chunk size
 */
export interface LanguageConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: any; // Tree-sitter Language object (varies by language module)
  minSize: number; // Minimum chunk size in characters
  maxSize: number; // Maximum chunk size in characters
}

/**
 * Unified language configuration
 * Each language maps to parser, minSize, and maxSize
 */
export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  javascript: {
    parser: JavaScript,
    minSize: 60,
    maxSize: 3000,
  },
  js: {
    parser: JavaScript,
    minSize: 60,
    maxSize: 3000,
  },
  typescript: {
    parser: TypeScriptModule.typescript,
    minSize: 60,
    maxSize: 1000,
  },
  ts: {
    parser: TypeScriptModule.typescript,
    minSize: 60,
    maxSize: 1000,
  },
  tsx: {
    parser: TypeScriptModule.tsx,
    minSize: 60,
    maxSize: 1000,
  },
  python: {
    parser: Python,
    minSize: 60,
    maxSize: 1000,
  },
  py: {
    parser: Python,
    minSize: 60,
    maxSize: 1000,
  },
  java: {
    parser: Java,
    minSize: 60,
    maxSize: 3000,
  },
  cpp: {
    parser: Cpp,
    minSize: 60,
    maxSize: 3000,
  },
  cxx: {
    parser: Cpp,
    minSize: 60,
    maxSize: 3000,
  },
  cc: {
    parser: Cpp,
    minSize: 60,
    maxSize: 3000,
  },
  c: {
    parser: Cpp,
    minSize: 60,
    maxSize: 3000,
  },
  go: {
    parser: Go,
    minSize: 60,
    maxSize: 3000,
  },
  rust: {
    parser: Rust,
    minSize: 60,
    maxSize: 3000,
  },
  rs: {
    parser: Rust,
    minSize: 60,
    maxSize: 3000,
  },
  ruby: {
    parser: Ruby,
    minSize: 60,
    maxSize: 3000,
  },
  rb: {
    parser: Ruby,
    minSize: 60,
    maxSize: 3000,
  },
  php: {
    parser: PHP,
    minSize: 60,
    maxSize: 3000,
  },
  kotlin: {
    parser: Kotlin,
    minSize: 60,
    maxSize: 3000,
  },
  kt: {
    parser: Kotlin,
    minSize: 60,
    maxSize: 3000,
  },
  css: {
    parser: CSS,
    minSize: 60,
    maxSize: 5000,
  },
  scss: {
    parser: SCSS,
    minSize: 60,
    maxSize: 5000,
  },
  html: {
    parser: HTML,
    minSize: 60,
    maxSize: 5000,
  },
  json: {
    parser: JSON,
    minSize: 60,
    maxSize: 5000,
  },
  yaml: {
    parser: YAML,
    minSize: 60,
    maxSize: 5000,
  },
  yml: {
    parser: YAML,
    minSize: 60,
    maxSize: 5000,
  },
  markdown: {
    parser: Markdown,
    minSize: 60,
    maxSize: 5000,
  },
  md: {
    parser: Markdown,
    minSize: 60,
    maxSize: 5000,
  },
  sql: {
    parser: SQL,
    minSize: 60,
    maxSize: 3000,
  },
};

/**
 * Default configuration for unsupported languages
 */
export const DEFAULT_CONFIG: LanguageConfig = {
  parser: null,
  minSize: 60,
  maxSize: 3000,
};

/**
 * Get language configuration by name
 */
export function getLanguageConfig(language: string): LanguageConfig {
  const normalized = language.toLowerCase();
  return LANGUAGE_CONFIG[normalized] || DEFAULT_CONFIG;
}
