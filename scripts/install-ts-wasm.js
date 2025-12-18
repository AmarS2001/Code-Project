import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const LANGUAGES = [
    // --- Web / Frontend ---
    "javascript",
    "typescript",
    "tsx",
    "html",
    "css",
    "scss",
    "json",

    // --- Backend / Systems ---
    "python",
    "java",
    "go",
    "rust",
    "cpp",
    "c",
    "csharp",

    // --- JVM / Enterprise ---
    "kotlin",
    "scala",

    // --- Scripting ---
    "bash",
    "lua",
    "perl",
    "ruby",
    "php",

    // --- Data / Config ---
    "yaml",
    "toml",
    "xml",
    "sql",

    // --- Infra / DevOps ---
    "dockerfile",
    "hcl",

    // --- Docs ---
    "markdown"
]

const WASM_OUT_DIR = path.resolve("tree-sitter-wasm");
fs.mkdirSync(WASM_OUT_DIR, { recursive: true });

for (const lang of LANGUAGES) {
    const pkg = `tree-sitter-${lang}`;

    console.log(`\n📦 Installing ${pkg} (temporary)`);

    try {
        execSync(`pnpm add ${pkg} --ignore-workspace`, { stdio: "inherit" });
    } catch (error) {
        console.error(`❌ Failed to install ${pkg}, skipping...`);
        continue;
    }

    try {
        const pkgRoot = path.dirname(
            require.resolve(`${pkg}/package.json`)
        );

        const wasmPath = findWasm(pkgRoot);

        if (!wasmPath) {
            console.warn(`⚠️  No WASM found for ${pkg}`);
            continue;
        }

        const outPath = path.join(
            WASM_OUT_DIR,
            path.basename(wasmPath)
        );

        fs.copyFileSync(wasmPath, outPath);
        console.log(`✅ Copied ${path.basename(outPath)}`);
    } catch (error) {
        console.error(`❌ Error processing ${pkg}:`, error.message);
    } finally {
        console.log(`🧹 Removing ${pkg}`);
        try {
            execSync(`pnpm remove ${pkg}`, { stdio: "inherit" });
        } catch (error) {
            console.warn(`⚠️  Failed to remove ${pkg}`);
        }
    }
}

function findWasm(dir) {
    for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        if (entry.endsWith(".wasm")) return fullPath;
        if (fs.statSync(fullPath).isDirectory()) {
            const nested = findWasm(fullPath);
            if (nested) return nested;
        }
    }
    return null;
}
