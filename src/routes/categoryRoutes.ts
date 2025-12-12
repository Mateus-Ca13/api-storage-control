import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from '../controllers/categoryControllers';

const router = Router();

router.get('/',  getAllCategoriesController);

router.get('/:id',  getCategoryByIdController);

router.post('/', createCategoryController);

router.put('/:id', updateCategoryController);

router.delete('/:id', deleteCategoryController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação