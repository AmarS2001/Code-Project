/**
 * Core types for the pipeline filtering system
 */

export interface FilterResult {
    allowed: boolean;
    reason?: string;
}

export interface IFilter {
    readonly name: string;
    filter(filePath: string): Promise<FilterResult>;
}
