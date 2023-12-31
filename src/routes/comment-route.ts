import express from 'express';
import commentController from '../controllers/comments/index.js';
import protectedRequest from '../middleware/protect-api.js';

const route = express.Router();

route.post('/', protectedRequest, commentController.create);
route.delete('/delete/:commentId', protectedRequest, commentController.delete);
route.patch('/update/:commentId', protectedRequest, commentController.update);
route.get('/article/:articleId', commentController.find);
route.post('/like', protectedRequest, commentController.like);
route.post('/dislike', protectedRequest, commentController.dislike);
route.post('/reply', protectedRequest, commentController.reply);

export default route;
