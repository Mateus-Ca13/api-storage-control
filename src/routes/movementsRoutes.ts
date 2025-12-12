import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { createMovementController, getAllMovementsController, getMovementByIdController } from '../controllers/movementsControllers';

const router = Router();

router.get('/',  getAllMovementsController);

router.get('/:id',  getMovementByIdController);

router.post('/', createMovementController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação