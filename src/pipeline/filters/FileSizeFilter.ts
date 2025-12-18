import { IFilter, FilterResult } from '../types';
import * as fs from 'fs/promises';

/**
 * Filters files based on size thresholds
 */
export class FileSizeFilter implements IFilter {
    readonly name = 'FileSizeFilter';
    private maxSizeBytes: number;

    /**
     * @param maxSizeMB - Maximum file size in megabytes (default: 10MB)
     */
    constructor(maxSizeMB: number = 10) {
        this.maxSizeBytes = maxSizeMB * 1024 * 1024;
    }

    async filter(filePath: string): Promise<FilterResult> {
        try {
            const stats = await fs.stat(filePath);
            
            if (stats.isDirectory()) {
                return { allowed: true };
            }

            if (stats.size > this.maxSizeBytes) {
                return {
                    allowed: false,
                    reason: `File size ${(stats.size / 1024 / 1024).toFixed(2)}MB exceeds max ${(this.maxSizeBytes / 1024 / 1024)}MB`
                };
            }

            return { allowed: true };
        } catch (error) {
            return {
                allowed: false,
                reason: `Error reading file stats: ${error}`
            };
        }
    }
}
