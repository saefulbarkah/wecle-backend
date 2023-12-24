import express from 'express';
import authorController from '../controllers/author/index.js';
import protectedRequest from '../middleware/protect-api.js';

const router = express.Router();

// route lists
router.get('/', authorController.lists);
router.patch('/update', protectedRequest, authorController.updateAuthor);
router.post('/follow', protectedRequest, authorController.follow);
router.post('/unfollow', protectedRequest, authorController.unfollow);
router.get('/:authorId', authorController.find);

export default router;
