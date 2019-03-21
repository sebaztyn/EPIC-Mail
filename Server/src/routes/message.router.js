import { Router } from 'express';
import msgControllers from '../controller3/msgControl';
import authenticate from '../middleware';

const router = Router();

router.post('/', authenticate, msgControllers.createMessage);
router.get('/', authenticate, msgControllers.findAllReceivedMessages);
router.get('/unread', authenticate, msgControllers.findUnreadMessages);
router.get('/sent', authenticate, msgControllers.findSentMessages);
router.get('/:id', authenticate, msgControllers.getOneMessage);
router.delete('/:id', authenticate, msgControllers.deleteMessage);

export default router;
