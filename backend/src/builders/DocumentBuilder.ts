export interface DocumentMetadata {
  schemaVersion: number;
  generatedAt: string;
  generatedBy: string;
}

export interface DocumentPayload {
  metadata: DocumentMetadata;
}

export interface DocumentBuilder<TPayload extends DocumentPayload> {
  build(id: string): Promise<TPayload>;
}
