export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export enum AIActionType {
  GENERATE_DRAFT = 'GENERATE_DRAFT',
  SUMMARIZE = 'SUMMARIZE',
  IMPROVE_WRITING = 'IMPROVE_WRITING',
  GENERATE_IDEAS = 'GENERATE_IDEAS'
}

export interface AIResponse {
  text: string;
  error?: string;
}
