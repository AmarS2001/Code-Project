import path from "path";
import { MACHINE_GENERATED_PATTERNS, MAX_FILE_SIZE, SKIP_DIRECTORIES, SKIP_EXTENSIONS } from "./constants/scan.constants";
import fs from "fs/promises";

export function shouldSkipDirectory(dirName: string): boolean {
    return SKIP_DIRECTORIES.has(dirName.toLowerCase());
}

export function shouldSkipFileExtension(extension: string): boolean {
    return SKIP_EXTENSIONS.has(extension.toLowerCase());
}

export function isMachineGenerated(fileName: string): boolean {
    return MACHINE_GENERATED_PATTERNS.some(pattern => pattern.test(fileName));
}

/**
 * Calculate Shannon entropy for a Buffer
 * High entropy (>7.0) indicates binary, compressed, or encrypted content
 * Low entropy (<6.0) typically indicates text files
 */
function calculateEntropy(buffer: Buffer): number {
    const freq = new Array(256).fill(0);
    for (const byte of buffer) {
        freq[byte]++;
    }
    const total = buffer.length;
    let entropy = 0;

    for (const count of freq) {
        if (count === 0) continue;
        const p = count / total;
        entropy -= p * Math.log2(p);
    }

    return entropy;
}

export async function isBinaryFile(filePath: string, stats: { size: number }): Promise<boolean> {
    // Skip if file is too large (likely binary or huge bundle)
    if (stats.size > MAX_FILE_SIZE) {
        return true;
    }

    // Skip if file is empty
    if (stats.size === 0) {
        return false; // Empty files are fine
    }

    try {
        // Read first 512 bytes to check for binary content
        const readSize = Math.min(512, stats.size);
        const handle = await fs.open(filePath, "r");
        const buffer = Buffer.alloc(readSize);
        const { bytesRead } = await handle.read(buffer, 0, readSize, 0);
        await handle.close();

        if (bytesRead === 0) {
            return false;
        }

        // Create a buffer with only the bytes that were read
        const actualBuffer = buffer.subarray(0, bytesRead);

        // Entropy-based detection: High entropy (>7.0) indicates binary/compressed/encrypted content
        const entropy = calculateEntropy(actualBuffer);
        if (entropy > 7.0) {
            return true; // High entropy = likely binary, compressed, or encrypted
        }

        // Check for null bytes (indicator of binary file)
        if (actualBuffer.includes(0)) {
            return true;
        }

        // Check if content is mostly non-printable characters
        let nonPrintableCount = 0;
        for (let i = 0; i < bytesRead; i++) {
            const byte = actualBuffer[i];
            // Allow common whitespace and printable ASCII
            if (byte < 9 || (byte > 13 && byte < 32 && byte !== 27)) {
                nonPrintableCount++;
            }
        }
        // If more than 30% are non-printable, likely binary
        return nonPrintableCount / bytesRead > 0.3;
    } catch {
        // If we can't read, assume it's problematic and skip
        return true;
    }
}

export async function findFilesByNames(directory: string, filenames: string[]): Promise<void> {
    // Clean filenames: extract just the filename part (before " - ")
    const cleanedFilenames = filenames.map(name => {
        const parts = name.split(" - ");
        return parts[0].trim();
    });
    const filenameSet = new Set(cleanedFilenames.map(name => name.toLowerCase()));

    async function searchDirectory(dir: string): Promise<void> {
        try {
            const files = await fs.readdir(dir);
            await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(dir, file);
                    
                    // Skip vendor/dependency directories
                    if (shouldSkipDirectory(file)) {
                        return;
                    }
                    
                    try {
                        const stats = await fs.stat(filePath);
                        if (stats.isDirectory()) {
                            await searchDirectory(filePath);
                        } else {
                            // Check if filename matches any in the array (case-insensitive)
                            if (filenameSet.has(file.toLowerCase())) {
                                console.log(filePath);
                            }
                        }
                    } catch {
                        // Skip corrupted or unreadable files
                    }
                })
            );
        } catch {
            // Skip directories that can't be accessed
        }
    }

    await searchDirectory(directory);
}

// await findFilesByNames("/Users/amarssajjanshetty/workfolder/Vyapar/new_mono_repo/vyapar-backend-monorepo", [".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", "NotoSansArabic-VariableFont_wdth,wght.ttf - ttf", "NotoSansBengali-VariableFont_wdth,wght.ttf - ttf", "NotoSansDevanagari-VariableFont_wdth,wght.ttf - ttf", "NotoSansGujarati-VariableFont_wdth,wght.ttf - ttf", "NotoSansKannada-VariableFont_wdth,wght.ttf - ttf", "NotoSansKayahLi-VariableFont_wght.ttf - ttf", "NotoSansMalayalam-VariableFont_wdth,wght.ttf - ttf", "NotoSansOriya-VariableFont_wdth,wght.ttf - ttf", "NotoSansTamil-VariableFont_wdth,wght.ttf - ttf", "NotoSansTelugu-VariableFont_wdth,wght.ttf - ttf", "88.vyp - vyp", "89.vyp - vyp", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", "Poppins-Medium.ttf - ttf", "poppins-v19-latin-200.ttf - ttf", "poppins-v19-latin-200.woff - woff", "poppins-v19-latin-200.woff2 - woff2", "poppins-v19-latin-200.eot - eot", "poppins-v19-latin-700.eot - eot", "poppins-v19-latin-700.ttf - ttf", "poppins-v19-latin-700.woff - woff", "poppins-v19-latin-700.woff2 - woff2", "poppins-v19-latin-regular.eot - eot", "poppins-v19-latin-regular.ttf - ttf", "poppins-v19-latin-regular.woff - woff", "poppins-v19-latin-regular.woff2 - woff2", "Poppins-Medium.ttf - ttf", "poppins-v19-latin-200.eot - eot", "poppins-v19-latin-200.ttf - ttf", "poppins-v19-latin-200.woff - woff", "poppins-v19-latin-200.woff2 - woff2", "poppins-v19-latin-700.eot - eot", "poppins-v19-latin-700.ttf - ttf", "poppins-v19-latin-700.woff - woff", "poppins-v19-latin-700.woff2 - woff2", "poppins-v19-latin-regular.eot - eot", "poppins-v19-latin-regular.ttf - ttf", "poppins-v19-latin-regular.woff - woff", "poppins-v19-latin-regular.woff2 - woff2", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - ", ".DS_Store - "]);