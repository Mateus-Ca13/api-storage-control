import { Router } from 'express';
import { loginUserController, logoutUserController, refreshTokenController, registerUserController } from '../controllers/authControllers';


const router = Router();

router.post('/register', registerUserController);

router.post('/login', loginUserController);

router.post('/logout', logoutUserController);

router.post('/refresh-token', refreshTokenController);

export default router;