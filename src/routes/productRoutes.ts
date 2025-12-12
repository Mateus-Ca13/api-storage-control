import { Router } from 'express';
import { createProductController, createProductsListController, deleteProductController, getAllProductsController, getProductByCodebarController, getProductByIdController, getProductsCsvToJsonController, updateProductController } from '../controllers/productControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/',  getAllProductsController);

router.get('/:id',  getProductByIdController);

router.get('/codebar/:codebar',  getProductByCodebarController);

router.post('/import-csv', upload.single('file'), getProductsCsvToJsonController)

router.post('/', createProductController);

router.post('/list', createProductsListController);

router.put('/:id', updateProductController);

router.delete('/:id', deleteProductController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação