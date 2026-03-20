import { BlogPost } from '../types';

const STORAGE_KEY = 'ink_spark_posts';

const SEED_DATA: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'Exploring how AI and new frameworks are reshaping the way we build the web.',
    content: `# The Future of Web Development\n\nWeb development is changing at a rapid pace. With the introduction of **AI-powered tools**, developers are becoming more efficient than ever.\n\n## Key Trends\n\n1. AI Assistants\n2. Edge Computing\n3. Serverless Architectures\n\nThe gap between frontend and backend is blurring, creating a new era of "Full Stack" capabilities accessible to everyone.`,
    author: 'Alex Dev',
    date: '2023-10-24',
    readTime: '5 min read',
    coverImage: 'https://picsum.photos/seed/tech/800/400',
    tags: ['Tech', 'AI', 'Web']
  },
  {
    id: '2',
    title: 'Finding Solace in Nature',
    excerpt: 'A personal journey through the mountains and what they taught me about patience.',
    content: `# Finding Solace in Nature\n\nLast summer, I took a trip to the Alps. The air was crisp, and the silence was deafening in the best way possible.\n\n> "In every walk with nature one receives far more than he seeks."\n\n## The Climb\n\nIt wasn't easy. The path was steep, but the view from the top made every step worth it.`,
    author: 'Sarah Walker',
    date: '2023-11-02',
    readTime: '3 min read',
    coverImage: 'https://picsum.photos/seed/nature/800/400',
    tags: ['Lifestyle', 'Travel', 'Nature']
  }
];

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.id === id);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === post.id);
  
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.unshift(post); // Add to top
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};
