import express from 'express';
import authorController from '../controllers/author/index.js';

const router = express.Router();

// route lists
router.get('/', authorController.lists);
router.patch('/update', authorController.updateAuthor);
router.post('/follow', authorController.follow);

export default router;
