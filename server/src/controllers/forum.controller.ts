import { Request, Response } from 'express';
import { ForumService } from '../services/forum.service';

export class ForumController {
  static async getPosts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const posts = await ForumService.getPosts(limit);
      res.json({ success: true, data: posts });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const post = await ForumService.createPost(req.body);
      res.json({ success: true, data: post });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async likePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Post ID is required' });
      await ForumService.likePost(id as string);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
