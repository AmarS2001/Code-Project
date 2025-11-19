import fs from "fs/promises";
import path from "path";
import { isBinaryFile, isMachineGenerated, shouldSkipDirectory, shouldSkipFileExtension } from "./utilites";
import { MAX_FILE_SIZE } from "./constants/scan.constants";
import langMap from "lang-map";
import { logger } from "./logger/logger";
import { chunkFile } from "./chunker/chunkerv2";



async function startScan(directory: string) {
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
                            const chunks = await chunkFile(filePath, language);
                            console.log(`${file} - ${language} (${chunks.length} chunks)`);
                            console.log(chunks)
                            
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

