import { IFilter, FilterResult } from '../types';
import * as path from 'path';

/**
 * Filters files based on allowed/blocked extensions
 */
export class FileExtensionFilter implements IFilter {
    readonly name = 'FileExtensionFilter';
    private excludedExtensions: Set<string>;

    /**
     * @param exclusions - List of extensions to exclude (with or without dot)
     */
    constructor(exclusions: string[]) {
        this.excludedExtensions = new Set(
            exclusions.map(ext => ext.startsWith('.') ? ext : `.${ext}`).map(e => e.toLowerCase())
        );
    }

    async filter(filePath: string): Promise<FilterResult> {
        const ext = path.extname(filePath).toLowerCase();
        // Allow directories or files without extension
        if (!ext) {
            return { allowed: true };
        }
        if (this.excludedExtensions.has(ext)) {
            return {
                allowed: false,
                reason: `Extension '${ext}' is excluded`
            };
        }
        return { allowed: true };
    }
}

