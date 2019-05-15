import { Router } from 'express';
import msgControllers from '../controller/msgControl';
import authenticate from '../middleware/authentication';
import validate from '../middleware/validator';

const router = Router();

router.post('/', authenticate, validate.createMessageValidator, msgControllers.createMessage);
router.get('/', authenticate, msgControllers.findAllReceivedMessages);
router.get('/unread', authenticate, msgControllers.findUnreadMessages);
router.get('/sent', authenticate, msgControllers.findSentMessages);
router.get('/:id', authenticate, msgControllers.getOneInboxMessage);
router.get('/sent/:id', authenticate, msgControllers.getOneSentMessage);
router.delete('/:id', authenticate, msgControllers.deleteInboxMessage);
router.delete('/sent/:sentMessageId', authenticate, msgControllers.deleteSentMessage);

export default router;
