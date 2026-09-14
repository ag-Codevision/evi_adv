export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  oab?: string;
  bio?: string;
  avatar_url?: string;
  is_director: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id?: string;
  category?: Category;
  author_id?: string;
  author?: Author;
  cover_image?: string;
  published_at: string;
  is_featured: boolean;
  reading_time: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PressItem {
  id: string;
  title: string;
  media_outlet: string;
  outlet_logo?: string;
  article_url?: string;
  quote?: string;
  published_at: string;
  category?: string;
}

export interface EditorialQueueItem {
  id: string;
  topic: string;
  target_category_slug: string;
  keywords: string[];
  target_audience?: string;
  status: 'pending' | 'processing' | 'published' | 'failed';
  generated_post_id?: string;
  error_message?: string;
  scheduled_for: string;
  created_at: string;
}
