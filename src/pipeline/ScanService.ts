import * as fs from 'fs/promises';
import * as path from 'path';
import { Pipeline } from './pipeline';

export interface ScanResult {
    accepted: string[];
    rejected: { path: string; reason: string }[];
    stats: {
        totalScanned: number;
        totalAccepted: number;
        totalRejected: number;
        duration: number;
    };
}

/**
 * Service that recursively scans directories and filters files using a Pipeline
 */
export class ScanService {
    private pipeline: Pipeline;
    private accepted: string[] = [];
    private rejected: { path: string; reason: string }[] = [];
    private scannedCount = 0;

    constructor(pipeline: Pipeline) {
        this.pipeline = pipeline;
    }

    /**
     * Scan a directory or file recursively
     * @param targetPath - Path to scan
     * @returns ScanResult with accepted/rejected files and statistics
     */
    async scan(targetPath: string): Promise<ScanResult> {
        const startTime = Date.now();
        this.reset();

        await this.scanPath(targetPath);

        const duration = Date.now() - startTime;

        return {
            accepted: this.accepted,
            rejected: this.rejected,
            stats: {
                totalScanned: this.scannedCount,
                totalAccepted: this.accepted.length,
                totalRejected: this.rejected.length,
                duration
            }
        };
    }

    /**
     * Recursively scan a path
     */
    private async scanPath(targetPath: string): Promise<void> {
        try {
            const stats = await fs.stat(targetPath);

            if (stats.isFile()) {
                await this.processFile(targetPath);
            } else if (stats.isDirectory()) {
                await this.processDirectory(targetPath);
            }
        } catch (error) {
            this.rejected.push({
                path: targetPath,
                reason: `Error accessing path: ${error}`
            });
        }
    }

    /**
     * Process a single file through the pipeline
     */
    private async processFile(filePath: string): Promise<void> {
        this.scannedCount++;
        
        const result = await this.pipeline.process(filePath);

        if (result.allowed) {
            this.accepted.push(filePath);
            console.log(`✅ ${filePath}`);
        } else {
            this.rejected.push({
                path: filePath,
                reason: result.reason || 'Unknown'
            });
            console.log(`❌ ${filePath} - ${result.reason}`);
        }
    }

    /**
     * Process a directory recursively
     */
    private async processDirectory(dirPath: string): Promise<void> {
        // First check if directory itself passes filters
        const dirResult = await this.pipeline.process(dirPath);
        
        if (!dirResult.allowed) {
            this.rejected.push({
                path: dirPath,
                reason: dirResult.reason || 'Directory excluded'
            });
            console.log(`❌ ${dirPath}/ - ${dirResult.reason}`);
            return; // Skip entire directory
        }

        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            // Process all entries
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                await this.scanPath(fullPath);
            }
        } catch (error) {
            this.rejected.push({
                path: dirPath,
                reason: `Error reading directory: ${error}`
            });
        }
    }

    /**
     * Generator that yields accepted files one by one
     */
    async *scanStream(targetPath: string): AsyncIterableIterator<string> {
        try {
            const stats = await fs.stat(targetPath);

            if (stats.isFile()) {
                this.scannedCount++;
                const result = await this.pipeline.process(targetPath);
                if (result.allowed) {
                    yield targetPath;
                } else {
                    // console.log(`❌ ${targetPath} - ${result.reason}`);
                }
            } else if (stats.isDirectory()) {
                const dirResult = await this.pipeline.process(targetPath);
                if (dirResult.allowed) {
                    try {
                        const entries = await fs.readdir(targetPath, { withFileTypes: true });
                        for (const entry of entries) {
                            const fullPath = path.join(targetPath, entry.name);
                            yield* this.scanStream(fullPath);
                        }
                    } catch (err) {
                        // ignore dir read errors
                    }
                }
            }
        } catch (error) {
            // ignore access errors
        }
    }

    /**
     * Reset scan state for a new scan
     */
    private reset(): void {
        this.accepted = [];
        this.rejected = [];
        this.scannedCount = 0;
    }
}
