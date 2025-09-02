import { Router } from 'express';
import { getMainSummaryController, getMovementsSummaryController, getProductsSummaryController, getStocksSummaryController, getUsersSummaryController } from '../controllers/dashboardControllers';

const router = Router();

router.get('/main', getMainSummaryController);

router.get('/stocks', getStocksSummaryController);

router.get('/products', getProductsSummaryController);

router.get('/movements', getMovementsSummaryController);

router.get('/users', getUsersSummaryController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação