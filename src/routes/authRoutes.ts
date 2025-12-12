import { Router } from 'express';
import { loginUserController, logoutUserController, refreshTokenController } from '../controllers/authControllers';


const router = Router();

router.post('/login', loginUserController);

router.post('/logout', logoutUserController);

router.post('/refresh-token', refreshTokenController);

export default router;