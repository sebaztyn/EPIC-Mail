import { Router } from 'express';
import authController from '../controller/authControl';
import validate from '../middleware/validator';

const router = Router();
router.post('/signup', validate.signupValidator, authController.addUser);
router.post('/login', validate.loginValidator, authController.login);
router.post('/reset', validate.passwordResetValidator, authController.passwordreset);
export default router;
