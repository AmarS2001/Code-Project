import { IFilter, FilterResult } from '../types';
import * as path from 'path';

/**
 * Filters directories based on patterns (e.g., node_modules, .git)
 */
export class DirectoryFilter implements IFilter {
    readonly name = 'DirectoryFilter';
    private excludedPatterns: Set<string>;
    private excludedPaths: Set<string>;

    /**
     * @param excludedDirs - List of directory names or patterns to exclude
     */
    constructor(excludedDirs: string[] = []) {
        this.excludedPatterns = new Set(excludedDirs);
        this.excludedPaths = new Set();
    }

    async filter(filePath: string): Promise<FilterResult> {
        const pathParts = filePath.split(path.sep);

        // Check if any part of the path matches excluded patterns
        for (const part of pathParts) {
            if (this.excludedPatterns.has(part)) {
                return {
                    allowed: false,
                    reason: `Path contains excluded directory: ${part}`
                };
            }
        }

        return { allowed: true };
    }
}
