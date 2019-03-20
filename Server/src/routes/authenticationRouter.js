import { Router } from 'express';
import authController from '../controller3/authControl';

const router = Router();
router.post('/signup', authController.addUser);
router.post('/login', authController.authorization);
router.post('/reset', authController.passwordreset);
// router.post('/signup', authenticationController.addUser);
// router.post('/login', authenticationController.authorization);
export default router;
