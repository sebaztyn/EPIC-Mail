import { Router } from 'express';
import messageControllers from '../controllers/message.controller';

const router = Router();

router.post('/', messageControllers.createMessage);
router.get('/', messageControllers.findAllReceivedMessages);
router.get('/unread', messageControllers.findUnreadMessages);
// router.get('/sent', messageControllers.findSentMessages);
// router.get('/:id', messageControllers.getOneMessage);
// router.delete('/:id', messageControllers.deleteMessage);

export default router;
