// Directories to skip (vendor/dependency directories)
export const SKIP_DIRECTORIES = new Set([
    "node_modules",
    "dist",
    "build",
    ".git",
    ".svn",
    ".hg",
    "vendor",
    "dependencies",
    "deps",
    ".deps",
    "target",
    "out",
    "bin",
    "obj",
    ".next",
    ".nuxt",
    ".cache",
    "coverage",
    ".nyc_output",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".venv",
    "venv",
    "env",
    ".env",
    "bower_components",
    ".gradle",
    ".idea",
    ".vscode",
    ".vs",
]);

// File extensions to skip (binaries, compiled outputs, large media)
export const SKIP_EXTENSIONS = new Set([
    // Binaries
    ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a", ".lib",
    // Compiled outputs
    ".class", ".jar", ".war", ".ear", ".pyc", ".pyo", ".pyd",
    // Media files
    ".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv",
    ".mp3", ".wav", ".flac", ".aac", ".ogg", ".wma",
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg", ".ico", ".webp",
    ".pdf", ".psd", ".ai", ".eps",
    // Archives
    ".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".rar",
    // Database files
    ".db", ".sqlite", ".sqlite3", ".mdb",
    // Other
    ".min.js", ".min.css", ".map", ".lock",
]);

// File size limit (10MB) - avoid huge auto-generated bundles
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Machine-generated file patterns
export const MACHINE_GENERATED_PATTERNS = [
    /\.min\.(js|css)$/i,
    /\.bundle\.(js|css)$/i,
    /\.chunk\.(js|css)$/i,
    /vendor\.(js|css)$/i,
    /^[a-f0-9]{20,}\.(js|css)$/i, // Hashed filenames
    /\.generated\./i,
    /\.auto\./i,
];

