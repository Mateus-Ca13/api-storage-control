import { Router } from 'express';
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from '../controllers/productControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';

const router = Router();

router.get('/',  getAllProductsController);

router.get('/:id',  getProductByIdController);

router.post('/', createProductController);

router.patch('/:id', updateProductController);

router.delete('/:id', deleteProductController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação