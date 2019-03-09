import { Router } from 'express';
import userControllers from '../controllers/user.controller';

const router = Router();
router.get('/:id', userControllers.findOneUser);
router.get('/', userControllers.findAllUsers);
router.delete('/:id', userControllers.deleteUser);

export default router;
