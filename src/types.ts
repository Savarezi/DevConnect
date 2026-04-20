/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeniorityLevel = 'Estagiário' | 'Trainee' | 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';

export interface Developer {
  id: string;
  ownerId: string;
  name: string;
  avatarUrl?: string;
  currentArea: string;
  interestArea: string;
  seniority: SeniorityLevel;
  linkedinUrl: string;
  githubUrl: string;
  createdAt: string;
  contributions?: number;
  codePosts?: number;
  coursePosts?: number;
}

export type DeveloperFormData = Omit<Developer, 'id' | 'createdAt' | 'ownerId'>;

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  createdAt: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  likesCount?: number;
  commentsCount?: number;
  hasLiked?: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface PostFormData {
  title: string;
  content: string;
  category: string;
}
