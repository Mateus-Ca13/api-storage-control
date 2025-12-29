import { Router } from 'express';
import { getMainSummaryController, getMovementsSummaryController, getProductsSummaryController, getStocksSummaryController, getUsersSummaryController } from '../controllers/dashboardControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';

const router = Router();

router.get('/main', authMiddleware, getMainSummaryController);

router.get('/stocks', authMiddleware, getStocksSummaryController);

router.get('/products', authMiddleware, getProductsSummaryController);

router.get('/movements', authMiddleware, getMovementsSummaryController);

router.get('/users', authMiddleware, getUsersSummaryController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação