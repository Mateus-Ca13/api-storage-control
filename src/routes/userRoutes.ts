import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddlewares';
import { createUserController, deleteUserController, getAllUsersController, getUserByIdController, updateUserController, updateUserPasswordController } from '../controllers/userControllers';

const router = Router();

router.get('/',  authMiddleware, getAllUsersController);

router.get('/:id',  authMiddleware, getUserByIdController);

router.put('/:id', authMiddleware, roleMiddleware(["SUPER_ADMIN"]), updateUserController);

router.put('/:id/password', authMiddleware, roleMiddleware(["SUPER_ADMIN"]), updateUserPasswordController);

router.post('/', authMiddleware, roleMiddleware(["SUPER_ADMIN"]) ,createUserController)

router.delete('/:id', authMiddleware, roleMiddleware(["SUPER_ADMIN"]), deleteUserController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação