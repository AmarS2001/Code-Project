import { QdrantClient } from '@qdrant/js-client-rest';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Chunk, toTOON } from '../chunker/types';

export class QdrantService {
  private client: QdrantClient;
  private embeddings: OllamaEmbeddings;
  private collectionName: string;
  private vectorSize: number;

  constructor(
    collectionName: string = 'code_chunks',
    ollamaModel: string = 'deepseek-coder:1.3b-base-q4_0',
    vectorSize: number = 2048,
    qdrantUrl: string = 'http://localhost:6333'
  ) {
    this.collectionName = collectionName;
    this.vectorSize = vectorSize;
    
    this.client = new QdrantClient({ url: qdrantUrl });
    
    this.embeddings = new OllamaEmbeddings({
      model: ollamaModel,
      baseUrl: "http://localhost:11434", 
    });
  }

  /**
   * Resets the collection (deletes and recreates it).
   */
  async resetCollection(): Promise<void> {
    const exists = await this.client.collectionExists(this.collectionName);
    if (exists) {
      await this.client.deleteCollection(this.collectionName);
    }
    
    await this.client.createCollection(this.collectionName, {
      vectors: {
        size: this.vectorSize,
        distance: 'Cosine',
      },
    });
    console.log(`Collection '${this.collectionName}' has been reset.`);
  }

  /**
   * Indexes the given chunks into Qdrant.
   */
  async indexChunks(chunks: Chunk[]): Promise<void> {
    if (chunks.length === 0) return;

    // Batching
    const batchSize = 10;
    const points: any[] = []; // Explicitly typed as any[] to avoid never[] inference

    console.log(`Indexing ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const textsToEmbed = batch.map(c => toTOON(c));
      
      const vectors = await this.embeddings.embedDocuments(textsToEmbed);

      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        
        const payload = {
            id: chunk.id,
            content: chunk.content,
            file_path: chunk.file_path,
            start_line: chunk.start_line,
            end_line: chunk.end_line,
            context_header: chunk.context_header,
            comments: chunk.comments,
            breadcrumbs: chunk.path.join(' > '),
            error: chunk.error,
            toon: textsToEmbed[j]
        };

        points.push({
          id: this.generateRandomId(), 
          vector: vectors[j],
          payload: payload,
        });
      }
    }

    if (points.length > 0) {
        await this.client.upsert(this.collectionName, {
            wait: true,
            points: points,
        });
    }
    console.log(`Indexed ${points.length} chunks successfully.`);
  }

  /**
   * Retrieves code chunks semantically similar to the query.
   */
  async retrieve(query: string, limit: number = 5, filter?: any): Promise<any[]> {
    const queryVector = await this.embeddings.embedQuery(query);
    
    const results = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit: limit,
      filter: filter,
      with_payload: true,
    });

    return results.map(res => ({
      score: res.score,
      ...res.payload
    }));
  }

  private generateRandomId(): string {
    // Qdrant supports UUID strings. We'll generate a pseudo-UUID.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
