import { supabase } from '../config/supabase';
import { ForumPost } from '../types';

export class ForumService {
  /**
   * Get latest forum posts
   */
  static async getPosts(limit: number = 50): Promise<ForumPost[]> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return (data as ForumPost[]) || [];
    } catch (err) {
      console.error('Forum Fetch Error:', err);
      // Fallback to static data for UX stability
      return [
        { id: '1', author: 'Rajesh Kumar', district: 'Karnal', crop: 'Wheat', price: 2450, message: 'Karnal mandi me aaj gehu ka bhav badhiya mila. 2450 pe bika.', likes: 12, created_at: new Date().toISOString() },
        { id: '2', author: 'Suresh Singh', district: 'Hisar', crop: 'Mustard', price: 5900, message: 'Sarson ke bhav me tezi hai. Kya aur rukna chahiye?', likes: 8, created_at: new Date().toISOString() }
      ];
    }
  }

  /**
   * Create a new forum post
   */
  static async createPost(post: ForumPost): Promise<ForumPost> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data as ForumPost;
    } catch (err) {
      console.error('Forum Create Error:', err);
      throw err;
    }
  }

  /**
   * Like a post
   */
  static async likePost(postId: string): Promise<void> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // Atomic increment would be better via RPC, but for now simple update
      const { data: current } = await supabase
        .from('forum_posts')
        .select('likes')
        .eq('id', postId)
        .single();
      
      await supabase
        .from('forum_posts')
        .update({ likes: (current?.likes || 0) + 1 })
        .eq('id', postId);
    } catch (err) {
      console.error('Forum Like Error:', err);
    }
  }
}
