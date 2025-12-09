import fs from "fs/promises";
import path from "path";
import { isBinaryFile, isMachineGenerated, shouldSkipDirectory, shouldSkipFileExtension } from "./utilites";
import { MAX_FILE_SIZE } from "./constants/scan.constants";
import langMap from "lang-map";
import { logger } from "./logger/logger";
import { CodeChunker } from "./chunker/chunker";
import { getLanguageConfig } from "./chunker/constants/chunk.constants";



async function startScan(directory: string) {
    const chunker = new CodeChunker();
    
    try {
        const files = await fs.readdir(directory);
        await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(directory, file);
                
                // Skip vendor/dependency directories
                if (shouldSkipDirectory(file)) {
                    return;
                }
                
                try {
                    const stats = await fs.stat(filePath);
                    if (stats.isDirectory()) {
                        await startScan(filePath);
                    } else {
                        // Skip machine-generated files
                        if (isMachineGenerated(file)) {
                            return;
                        }

                        const extension = path.extname(file);
                        
                        // Skip binaries, compiled outputs, large media
                        if (shouldSkipFileExtension(extension)) {
                            return;
                        }

                        // Avoid huge auto-generated bundles
                        if (stats.size > MAX_FILE_SIZE) {
                            return;
                        }

                        // Avoid misnamed binaries (check if file is actually binary)
                        if (await isBinaryFile(filePath, stats)) {
                            return;
                        }

                        // Process the file
                        const languages = langMap.languages(extension);
                        const language = languages[0] || "unknown";
                        
                        // Chunk the file
                        try {
                            const source = await fs.readFile(filePath, "utf-8");
                            const chunks = await chunker.chunkFile(filePath, language);

                            console.log(JSON.stringify(chunks, null, 2));
                            
                            const config = getLanguageConfig(language);
                            
                            // Analyze quality with language-specific sizes
                            const quality = chunker.analyzeQuality(chunks, source, config.minSize, config.maxSize);
                            
                            // Log summary
                            logger.info(
                                {
                                    message: "File chunked successfully",
                                    data: {
                                        file,
                                        language,
                                        chunks: quality.totalChunks,
                                        avgSize: quality.avgSize,
                                        quality: quality.isGoodQuality ? "✅ GOOD" : "⚠️ NEEDS IMPROVEMENT",
                                        complete: quality.isComplete ? "✅" : `❌ (${quality.missingChars} missing)`
                                    }
                                },
                                "startScan"
                            );
                            
                            // Log detailed quality metrics
                            chunker.logQuality(quality, file);
                            
                        } catch (chunkError) {
                            logger.error(
                                { message: 'Error chunking file', data: { filePath, language } },
                                'startScan',
                                chunkError
                            );
                        }
                    }
                } catch(error) {
                    // Skip corrupted or unreadable files
                    logger.error({message: 'Skipping corrupted or unreadable file', data: {filePath}}, 'startScan', error);
                }
            })
        );
    } catch(error) {
        logger.error({message: 'Error scanning directory', data: {directory}}, 'startScan', error);
    }
}

// startScan("/Users/amarssajjanshetty/workfolder/Vyapar/new_mono_repo/vyapar-backend-monorepo");
startScan("/Users/amarssajjanshetty/workfolder5/project/src/test")

