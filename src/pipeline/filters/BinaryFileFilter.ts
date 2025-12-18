import { IFilter, FilterResult } from '../types';
import * as fs from 'fs/promises';

/**
 * Filters binary files using entropy calculation
 * High entropy typically indicates binary/compressed data
 */
export class BinaryFileFilter implements IFilter {
    readonly name = 'BinaryFileFilter';
    private entropyThreshold: number;
    private sampleSize: number;

    /**
     * @param entropyThreshold - Threshold above which file is considered binary (default: 7.0)
     * @param sampleSize - Number of bytes to sample for entropy calculation (default: 8192)
     */
    constructor(entropyThreshold: number = 7.0, sampleSize: number = 8192) {
        this.entropyThreshold = entropyThreshold;
        this.sampleSize = sampleSize;
    }

    private calculateEntropy(buffer: Buffer): number {
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

    async filter(filePath: string): Promise<FilterResult> {
        try {
            const stats = await fs.stat(filePath);
            
            if (stats.isDirectory()) {
                return { allowed: true };
            }

            // Read sample of file
            const handle = await fs.open(filePath, 'r');
            const sampleSize = Math.min(this.sampleSize, stats.size);
            const buffer = Buffer.alloc(sampleSize);
            
            try {
                await handle.read(buffer, 0, sampleSize, 0);
            } finally {
                await handle.close();
            }

            const entropy = this.calculateEntropy(buffer);

            if (entropy > this.entropyThreshold) {
                return {
                    allowed: false,
                    reason: `Binary file detected (entropy: ${entropy.toFixed(2)} > ${this.entropyThreshold})`
                };
            }

            return { allowed: true };
        } catch (error) {
            return {
                allowed: false,
                reason: `Error checking binary status: ${error}`
            };
        }
    }
}
