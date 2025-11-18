export interface Chunk {
    id: string;
    startLine: number;
    endLine: number;
    code: string;
    path: string;
    comment: string;
    error: boolean;
}