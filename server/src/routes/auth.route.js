import Router from 'express';
import { emailLoginUser, googleLoginUser, logout, registerUser, resetRefreshToken } from '../controllers/auth.controller.js';
import checkValidation from '../middlewares/validation.middleware.js';
import { authLoginValidation, authRegisterDataValidation } from '../validators/auth.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const authRouter = Router();

authRouter.post('/register', checkValidation(authRegisterDataValidation), registerUser);
authRouter.post('/login', checkValidation(authLoginValidation), emailLoginUser);
authRouter.post('/google/login', googleLoginUser);
authRouter.get('/resetTokens', resetRefreshToken);
authRouter.get('/logout', authMiddleware, logout);

export default authRouter;