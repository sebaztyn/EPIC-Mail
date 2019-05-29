import { Router } from 'express';
import groupControllers from '../controller/groupController';
import authenticate from '../middleware/authentication';
import isAdmin from '../middleware/isAdmin';
import validate from '../middleware/validator';

const router = Router();

router.post('/', authenticate, validate.createNewGroup, groupControllers.createGroup);

router.post('/:groupId/messages', authenticate, validate.groupMessageValidator, groupControllers.groupMessage);

router.post('/:groupId/users/', authenticate, isAdmin, validate.addGroupUsers, groupControllers.addUser);

router.get('/', authenticate, groupControllers.getAllGroupsByAUser);

router.patch('/:groupId/name', authenticate, isAdmin, validate.changeGroupName, groupControllers.changeGroupName);

router.delete('/:groupId', authenticate, isAdmin, groupControllers.deleteAgroup);
router.delete('/:groupId/users/:userid', authenticate, isAdmin, groupControllers.deleteUser);

export default router;
