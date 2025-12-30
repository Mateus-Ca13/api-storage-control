import { Router } from 'express';
import { createProductController, createProductsListController, deleteProductController, getAllProductsController, getProductByCodebarController, getProductByIdController, getProductsCsvToJsonController, updateProductController } from '../controllers/productControllers';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddlewares';
import uploadMiddleware from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/',  authMiddleware, getAllProductsController);

router.get('/:id',  authMiddleware, getProductByIdController);

router.get('/codebar/:codebar',  authMiddleware, getProductByCodebarController);

router.post('/import-csv', uploadMiddleware, authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), getProductsCsvToJsonController)

router.post('/', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), createProductController);

router.post('/list', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), createProductsListController);

router.put('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), updateProductController);

router.delete('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]),deleteProductController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação