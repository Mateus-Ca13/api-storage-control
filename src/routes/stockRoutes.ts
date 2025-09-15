import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { createStockController, deleteStockController, getAllStocksController, getStockByIdController, updateStockController } from '../controllers/stockControllers';

const router = Router();

router.get('/',  getAllStocksController);

router.get('/:id',  getStockByIdController);

router.post('/', createStockController);

router.patch('/:id', updateStockController);

router.delete('/:id', deleteStockController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação