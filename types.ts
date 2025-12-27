
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  following: string[]; // List of followed usernames
  collections: string[]; // List of algorithm IDs
}

export interface Algorithm {
  id: string;
  cube_type: string; // e.g., 2x2, 3x3, pyraminx, megaminx
  title: string;
  category: string; // e.g., PLL, OLL, F2L, Custom
  algorithm: string;
  contributor: string; // Username
  stars: number;
  images: string[]; // Base64 encoded images (max 6)
  comment_ids: string[];
}

export interface Comment {
  id: string;
  algorithm_id: string;
  content: string;
  author: string; // Username
  create_time: string;
  like_count: number;
}

export type Page = 'home' | 'login' | 'register' | 'upload' | 'profile' | 'about' | 'detail';

export const CUBE_TYPES = ['2x2', '3x3', '4x4', 'Pyraminx', 'Megaminx', 'Skewb', 'Square-1'];
export const CATEGORIES = ['OLL', 'PLL', 'F2L', 'CMLL', 'CLL', 'ELL', 'Custom'];
