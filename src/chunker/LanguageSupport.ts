import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import TypeScript from 'tree-sitter-typescript';
import Python from 'tree-sitter-python';
import Java from 'tree-sitter-java';
import Go from 'tree-sitter-go';
// Add others as needed from package.json

// Map of extension to language instance
// We instantiate them once or lazy load
const languageMap: Record<string, any> = {
  'js': JavaScript,
  'jsx': JavaScript,
  'ts': TypeScript.typescript,
  'tsx': TypeScript.tsx,
  'py': Python,
  'java': Java,
  'go': Go,
  // Add more mappings
};

export function getLanguageForExtension(ext: string): any {
  const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext;
  return languageMap[cleanExt];
}

export function getLanguage(langName: string): any {
    // Basic normalization
    const lower = langName.toLowerCase();
    if (lower === 'javascript' || lower === 'js') return JavaScript;
    if (lower === 'typescript' || lower === 'ts') return TypeScript.typescript;
    if (lower === 'tsx') return TypeScript.tsx;
    if (lower === 'python' || lower === 'py') return Python;
    if (lower === 'java') return Java;
    if (lower === 'go') return Go;
    return null;
}
