import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddlewares';
import { createStockController, deleteStockController, getAllStocksController, getStockByIdController, updateStockController } from '../controllers/stockControllers';

const router = Router();

router.get('/',  authMiddleware, getAllStocksController);

router.get('/:id',  authMiddleware, getStockByIdController);

router.post('/', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), createStockController);

router.put('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), updateStockController);

router.delete('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), deleteStockController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação