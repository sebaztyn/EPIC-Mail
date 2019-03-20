import { Router } from 'express';
// import messageControllers from '../controllers/message.controller';
import msgControllers from '../controller3/msgControl';
import authenticate from '../middleware';

const router = Router();

router.post('/', authenticate, msgControllers.createMessage);
router.get('/', authenticate, msgControllers.findAllReceivedMessages);
router.get('/unread', authenticate, msgControllers.findUnreadMessages);
// router.get('/sent', authenticate, messageControllers.findSentMessages);
// router.get('/:id', authenticate, messageControllers.getOneMessage);
// router.delete('/:id', authenticate, messageControllers.deleteMessage);

export default router;
