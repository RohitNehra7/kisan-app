import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller';

const router = Router();

router.get('/posts', ForumController.getPosts);
router.post('/posts', ForumController.createPost);
router.post('/posts/:id/like', ForumController.likePost);

export default router;
