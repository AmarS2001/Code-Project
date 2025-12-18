import { IFilter, FilterResult } from '../types';
import * as path from 'path';

export class FileFilter implements IFilter {
    readonly name = 'FileFilter';
    private excludedFiles: Set<string>;

    constructor(excludedFiles: string[] = []) {
        this.excludedFiles = new Set(excludedFiles);
    }

    async filter(filePath: string): Promise<FilterResult> {
        const basename = path.basename(filePath);
        
        if (this.excludedFiles.has(basename)) {
            return {
                allowed: false,
                reason: `File excluded: ${basename}`
            };
        }

        return { allowed: true };
    }
}

export const HiddenFileFilter = FileFilter;
