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


// Language-specific character size limits (in characters)
// These limits determine when to split large AST nodes into smaller chunks
export const LANGUAGE_SIZE_LIMITS: Record<string, number> = {
    javascript: 3000,
    typescript: 1500,
    python: 1000,
    java: 3000,
    cpp: 3000,
    c: 3000,
    go: 3000,
    rust: 3000,
    ruby: 3000,
    php: 3000,
    kotlin: 3000,
    css: 5000,
    scss: 5000,
    html: 5000,
    json: 5000,
    yaml: 5000,
    markdown: 5000,
    sql: 3000,
    default: 3000,
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LANGUAGE_PARSERS: Record<string, any> = {
    javascript: JavaScript,
    js: JavaScript,
    typescript: TypeScriptModule.typescript,
    ts: TypeScriptModule.typescript,
    tsx: TypeScriptModule.tsx,
    python: Python,
    py: Python,
    java: Java,
    cpp: Cpp,
    cxx: Cpp,
    cc: Cpp,
    c: Cpp,
    go: Go,
    rust: Rust,
    rs: Rust,
    ruby: Ruby,
    rb: Ruby,
    php: PHP,
    kotlin: Kotlin,
    kt: Kotlin,
    css: CSS,
    scss: SCSS,
    html: HTML,
    json: JSON,
    yaml: YAML,
    yml: YAML,
    markdown: Markdown,
    md: Markdown,
    sql: SQL,
};


  // Common identifier node types across different languages
  export const IDENTIFIER_TYPES_SET = new Set([
    "identifier",
    "property_identifier",
    "type_identifier",
    "field_identifier",
    "method_identifier",
    "function_identifier",
    "class_identifier",
    "name",
    "tag_name",
    "attribute_name",
  ]);