import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";
import { Chunk } from "../chunker/interfaces/chunk.interface";
import { logger } from "../logger/logger";

export class QdrantService {
  private vectorStore: QdrantVectorStore | null = null;
  private embeddings: OllamaEmbeddings;
  private collectionName: string;
  private qdrantUrl: string;

  constructor(
    collectionName: string = "code_chunks",
    qdrantUrl: string = "http://localhost:6333"
  ) {
    this.collectionName = collectionName;
    this.qdrantUrl = qdrantUrl;
    
    // Initialize Ollama embeddings
    this.embeddings = new OllamaEmbeddings({
      model: "qwen2.5-coder:7b",
      baseUrl: "http://localhost:11434",
    });
  }

  async initialize(): Promise<void> {
    try {
      // Try to connect to existing collection first
      this.vectorStore = await QdrantVectorStore.fromExistingCollection(
        this.embeddings,
        {
          url: this.qdrantUrl,
          collectionName: this.collectionName,
        }
      );
      logger.info(
        { message: "Connected to existing Qdrant collection", data: { collectionName: this.collectionName } },
        "QdrantService.initialize"
      );
    } catch {
      // Collection doesn't exist, create it with a placeholder document
      try {
        this.vectorStore = await QdrantVectorStore.fromDocuments(
          [new Document({ pageContent: "init", metadata: { init: true } })],
          this.embeddings,
          {
            url: this.qdrantUrl,
            collectionName: this.collectionName,
          }
        );
        logger.info(
          { message: "Created new Qdrant collection", data: { collectionName: this.collectionName } },
          "QdrantService.initialize"
        );
      } catch (createError) {
        logger.error(
          { message: "Failed to create Qdrant collection", data: { collectionName: this.collectionName } },
          "QdrantService.initialize",
          createError
        );
        throw createError;
      }
    }
  }

  async indexChunks(chunks: Chunk[]): Promise<void> {
    if (!this.vectorStore) {
      throw new Error("Qdrant service not initialized. Call initialize() first.");
    }

    try {
      const documents = chunks.map((chunk) => 
        new Document({
          pageContent: chunk.code,
          metadata: {
            id: chunk.id,
            filePath: chunk.path,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            nodeType: chunk.nodeType,
            comment: chunk.comment,
            hasError: chunk.error,
          },
        })
      );

      await this.vectorStore.addDocuments(documents);
      
      logger.info(
        {
          message: "Indexed chunks into Qdrant",
          data: {
            collectionName: this.collectionName,
            chunkCount: chunks.length,
          },
        },
        "QdrantService.indexChunks"
      );
    } catch (error) {
      logger.error(
        { message: "Error indexing chunks into Qdrant", data: { chunkCount: chunks.length } },
        "QdrantService.indexChunks",
        error
      );
      throw error;
    }
  }

  async search(query: string, limit: number = 5): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error("Qdrant service not initialized. Call initialize() first.");
    }

    try {
      const results = await this.vectorStore.similaritySearch(query, limit);
      return results;
    } catch (error) {
      logger.error(
        { message: "Error searching Qdrant", data: { query, limit } },
        "QdrantService.search",
        error
      );
      throw error;
    }
  }
}

