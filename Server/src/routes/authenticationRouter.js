import { Router } from 'express';
import authenticationController from '../controllers/authentication.controller';

const router = Router();
router.post('/signup', authenticationController.addUser);
export default router;
