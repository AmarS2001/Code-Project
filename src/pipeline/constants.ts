export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const BINARY_FILE_ENTROPY_THRESHOLD = 7.0;
export const EXCLUDED_DIRS = [
  // --- Dependencies ---
  "node_modules",
  "vendor",
  "bower_components",
  "packages",
  "deps",

  // --- Build / Output ---
  "dist",
  "build",
  "out",
  "target",
  "bin",
  "obj",
  "release",
  "debug",
  "coverage",
  ".nyc_output",

  // --- Cache / Temp ---
  ".cache",
  ".tmp",
  ".temp",
  "tmp",
  "temp",
  ".eslintcache",
  ".parcel-cache",
  ".turbo",
  ".vite",
  ".next",
  ".nuxt",
  ".svelte-kit",

  // --- Version Control ---
  ".git",
  ".github",
  ".gitlab",
  ".husky",

  // --- IDE / Editor ---
  ".vscode",
  ".idea",
  ".fleet",
  ".settings",

  // --- Logs ---
  "logs",
  "log",

  // --- Python ---
  "__pycache__",
  ".venv",
  "venv",
  "env",
  ".mypy_cache",
  ".pytest_cache",

  // --- Java / JVM ---
  ".gradle",
  ".idea_modules",

  // --- Go ---
  "pkg",

  // --- Mobile ---
  ".expo",
  ".gradle-cache",

  // --- Infra / Containers ---
  ".terraform",
  ".terraform.lock.hcl",

  // --- OS ---
  ".DS_Store",
  "Thumbs.db",

  // --- Docs Build ---
  "_site",
  ".docusaurus",
  ".vuepress",
];

export const EXCLUDED_EXTENSIONS = [
  // --- Binaries ---
  ".exe", ".dll", ".so", ".dylib",

  // --- Archives ---
  ".zip", ".tar", ".gz", ".rar", ".7z",

  // --- Media ---
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
  ".mp4", ".mov", ".avi", ".mp3", ".wav",

  // --- Fonts ---
  ".ttf", ".otf", ".woff", ".woff2",

  // --- PDFs / Docs ---
  ".pdf", ".doc", ".docx", ".ppt", ".pptx",

  // --- Data Dumps ---
  ".csv", ".tsv", ".parquet", ".avro",

  // --- WASM / Binary JS ---
  ".wasm", ".min.js", ".map"
];

export const EXCLUDED_FILES = [
  // --- Package / Dependency Locks ---
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  "composer.lock",
  "poetry.lock",
  "Pipfile.lock",
  "Cargo.lock",
  "Gemfile.lock",
  "mix.lock",

  // --- Environment / Secrets ---
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",

  // --- Build Config Noise ---
  "tsconfig.tsbuildinfo",
  ".babelrc",
  ".babelrc.json",
  ".babelrc.js",
  "babel.config.js",
  "babel.config.json",
  "webpack.config.js",
  "vite.config.js",
  "rollup.config.js",
  "esbuild.config.js",

  // --- Lint / Formatter ---
  ".eslintrc",
  ".eslintrc.json",
  ".eslintrc.js",
  ".eslintignore",
  ".prettierrc",
  ".prettierrc.json",
  ".prettierrc.js",
  ".prettierignore",
  ".stylelintrc",
  ".stylelintrc.json",

  // --- Test / Coverage Output ---
  "coverage.json",
  "lcov.info",
  "junit.xml",
  "test-results.xml",

  // --- Logs ---
  "npm-debug.log",
  "yarn-error.log",
  "pnpm-debug.log",

  // --- OS / Editor ---
  ".DS_Store",
  "Thumbs.db",
  ".editorconfig",

  // --- Docs Build / Site ---
  "mkdocs.yml",
  "docusaurus.config.js",
  "vuepress.config.js",

  // --- Generated API / SDK ---
  "openapi.json",
  "openapi.yaml",
  "swagger.json",
  "swagger.yaml",

  // --- Binary / Media (explicit names) ---
  "favicon.ico",
  "logo.png",
  "logo.svg",
  "banner.jpg",

  // --- Runtime State ---
  ".node_repl_history",
  ".python_history"
];


