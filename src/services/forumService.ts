/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { ForumPost, ForumComment, PostFormData } from '../types';

export const forumService = {
  getPosts: async (): Promise<ForumPost[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch posts with author info (from profiles table)
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles(
          name,
          avatar_url
        ),
        likes:forum_likes(count),
        comments:forum_comments(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    // Check if user has liked each post
    let likedPostIds: string[] = [];
    if (user) {
      const { data: likes } = await supabase
        .from('forum_likes')
        .select('post_id')
        .eq('user_id', user.id);
      likedPostIds = (likes || []).map(l => l.post_id);
    }

    return (data || []).map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      externalLink: post.external_link,
      authorId: post.author_id,
      createdAt: post.created_at,
      author: {
        name: post.author?.name || 'Dev Anônimo',
        avatarUrl: post.author?.avatar_url
      },
      likesCount: post.likes?.[0]?.count || 0,
      commentsCount: post.comments?.[0]?.count || 0,
      hasLiked: likedPostIds.includes(post.id)
    }));
  },

  createPost: async (data: PostFormData): Promise<ForumPost> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    const { data: inserted, error } = await supabase
      .from('forum_posts')
      .insert([{
        title: data.title,
        content: data.content,
        category: data.category,
        external_link: data.externalLink,
        author_id: user.id
      }])
      .select(`
        *,
        author:profiles(
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    
    return {
      id: inserted.id,
      title: inserted.title,
      content: inserted.content,
      category: inserted.category,
      externalLink: inserted.external_link,
      authorId: inserted.author_id,
      createdAt: inserted.created_at,
      author: {
        name: inserted.author?.name || 'Dev Anônimo',
        avatarUrl: inserted.author?.avatar_url
      }
    };
  },

  getComments: async (postId: string): Promise<ForumComment[]> => {
    const { data, error } = await supabase
      .from('forum_comments')
      .select(`
        *,
        author:profiles(
          name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return (data || []).map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      content: comment.content,
      createdAt: comment.created_at,
      author: {
        name: comment.author?.name || 'Dev Anônimo',
        avatarUrl: comment.author?.avatar_url
      }
    }));
  },

  addComment: async (postId: string, content: string): Promise<ForumComment> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    const { data: inserted, error } = await supabase
      .from('forum_comments')
      .insert([{
        post_id: postId,
        author_id: user.id,
        content
      }])
      .select(`
        *,
        author:profiles(
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    
    return {
      id: inserted.id,
      postId: inserted.post_id,
      authorId: inserted.author_id,
      content: inserted.content,
      createdAt: inserted.created_at,
      author: {
        name: inserted.author?.name || 'Dev Anônimo',
        avatarUrl: inserted.author?.avatar_url
      }
    };
  },

  toggleLike: async (postId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    // Check if already liked
    const { data: existing } = await supabase
      .from('forum_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Unlike
      await supabase
        .from('forum_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      return false;
    } else {
      // Like
      await supabase
        .from('forum_likes')
        .insert([{ post_id: postId, user_id: user.id }]);
      return true;
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);
    if (error) throw error;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    const { error } = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', commentId);
    if (error) throw error;
  }
};
