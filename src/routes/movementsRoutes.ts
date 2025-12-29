import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddlewares';
import { createMovementController, deleteMovementController, getAllMovementsController, getMovementByIdController } from '../controllers/movementsControllers';

const router = Router();

router.get('/',  authMiddleware, getAllMovementsController);

router.get('/:id',  authMiddleware, getMovementByIdController);

router.post('/', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), createMovementController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação