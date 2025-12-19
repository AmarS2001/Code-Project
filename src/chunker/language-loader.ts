import { Language } from 'web-tree-sitter';

// Lazy loader map: each extension maps to a function returning a Promise<Language>
export const getLanguageFromExtPromise: Record<string, () => Promise<Language>> = {
  'js': () => Language.load('./tree-sitter-wasm/tree-sitter-javascript.wasm'),
  'jsx': () => Language.load('./tree-sitter-wasm/tree-sitter-javascript.wasm'),
  'ts': () => Language.load('./tree-sitter-wasm/tree-sitter-tsx.wasm'),
  'tsx': () => Language.load('./tree-sitter-wasm/tree-sitter-tsx.wasm'),
  'py': () => Language.load('./tree-sitter-wasm/tree-sitter-python.wasm'),
  'java': () => Language.load('./tree-sitter-wasm/tree-sitter-java.wasm'),
  'go': () => Language.load('./tree-sitter-wasm/tree-sitter-go.wasm'),
  'json': () => Language.load('./tree-sitter-wasm/tree-sitter-json.wasm'),
  'yaml': () => Language.load('./tree-sitter-wasm/tree-sitter-yaml.wasm'),
  'html': () => Language.load('./tree-sitter-wasm/tree-sitter-html.wasm'),
  'css': () => Language.load('./tree-sitter-wasm/tree-sitter-css.wasm'),
  'rust': () => Language.load('./tree-sitter-wasm/tree-sitter-rust.wasm'),
  'c': () => Language.load('./tree-sitter-wasm/tree-sitter-c.wasm'),
  'cpp': () => Language.load('./tree-sitter-wasm/tree-sitter-cpp.wasm'),
  'rs': () => Language.load('./tree-sitter-wasm/tree-sitter-rust.wasm'),
};

export function getLanguage(name: string) { return null; }
