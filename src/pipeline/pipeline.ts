import { BINARY_FILE_ENTROPY_THRESHOLD, EXCLUDED_DIRS, EXCLUDED_EXTENSIONS, EXCLUDED_FILES, FILE_SIZE_LIMIT } from './constants';
import { IFilter, FilterResult } from './types';
import { FileSizeFilter } from './filters/FileSizeFilter';
import { FileExtensionFilter } from './filters/FileExtensionFilter';
import { BinaryFileFilter } from './filters/BinaryFileFilter';
import { DirectoryFilter } from './filters/DirectoryFilter';
import { FileFilter } from './filters/FileFilter';

/**
 * Pipeline that chains multiple filters together
 * Files must pass ALL filters to be accepted
 */
export class Pipeline {
    private filters: IFilter[] = [];

    /**
     * Add a filter to the pipeline
     */
    addFilter(filter: IFilter): this {
        this.filters.push(filter);
        return this;
    }

    /**
     * Add multiple filters at once
     */
    addFilters(filters: IFilter[]): this {
        this.filters.push(...filters);
        return this;
    }

    /**
     * Process a file through all filters
     * @returns FilterResult - allowed is true only if ALL filters pass
     */
    async process(filePath: string): Promise<FilterResult> {
        for (const filter of this.filters) {
            const result = await filter.filter(filePath);
            
            if (!result.allowed) {
                return {
                    allowed: false,
                    reason: `[${filter.name}] ${result.reason || 'Rejected'}`
                };
            }
        }

        return { allowed: true };
    }

    /**
     * Create a default pipeline for code indexing
     */
    static createDefault(): Pipeline {
        return new Pipeline()
            .addFilter(new DirectoryFilter(EXCLUDED_DIRS))
            .addFilter(new FileFilter(EXCLUDED_FILES))
            .addFilter(new FileExtensionFilter(EXCLUDED_EXTENSIONS))
            .addFilter(new FileSizeFilter(FILE_SIZE_LIMIT)) // 10MB max
            .addFilter(new BinaryFileFilter(BINARY_FILE_ENTROPY_THRESHOLD)); // entropy threshold
    }
}
