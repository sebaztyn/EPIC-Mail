import { Router } from 'express';
import groupControllers from '../controller3/groupController';
import authenticate from '../middleware';

const router = Router();

router.post('/', authenticate, groupControllers.createGroup);
router.post('/:id/users/', authenticate, groupControllers.addUser);
router.get('/', authenticate, groupControllers.getAllGroups);
router.patch('/:id/name', authenticate, groupControllers.changeGroupName);
router.delete('/:id', authenticate, groupControllers.deleteAgroup);

export default router;
