import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { createUserController, deleteUserController, getAllUsersController, getUserByIdController, updateUserController, updateUserPasswordController } from '../controllers/userControllers';

const router = Router();

router.get('/',  getAllUsersController);

router.get('/:id',  getUserByIdController);

router.put('/:id', updateUserController);

router.put('/:id/password', updateUserPasswordController);

router.post('/', createUserController)

router.delete('/:id', deleteUserController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação