import express from 'express';
import protectedRequest from '../middleware/protect-api.js';
import notificationController from '../controllers/notifications/index.js';

const route = express.Router();

route.get('/find/:receiverId', protectedRequest, notificationController.get);
route.post('/read-one', protectedRequest, notificationController.readOne);
route.post('/read-all', protectedRequest, notificationController.readAll);

export default route;
