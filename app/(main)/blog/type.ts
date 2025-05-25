export interface BlogPost {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt?: string;
    updatedAt?: string;
    authorId: string;
    comments: Comment[] | null;
    excerpt?: string;
    category?: string;
    tags?: string[];
    readTime?: number;
    views?: number;
    likes?: number;
    featured?: boolean;
    author?: {
      name: string;
      avatar: string;
      bio: string;
    };
  }
  
  export interface Comment {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
  }
  
  export interface BlogState {
    posts: BlogPost[];
    selectedPost: BlogPost | null;
    searchQuery: string;
    selectedCategory: string;
    viewMode: "grid" | "list";
    sortBy: "newest" | "oldest" | "popular" | "liked";
  }
  
  export interface BlogFilters {
    searchQuery: string;
    category: string;
    sortBy: "newest" | "oldest" | "popular" | "liked";
  } 