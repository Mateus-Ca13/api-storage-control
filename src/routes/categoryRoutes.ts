import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddlewares';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from '../controllers/categoryControllers';

const router = Router();

router.get('/',  authMiddleware, getAllCategoriesController);

router.get('/:id',  authMiddleware, getCategoryByIdController);

router.post('/', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]), createCategoryController);

router.put('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]),updateCategoryController);

router.delete('/:id', authMiddleware, roleMiddleware(["ADMIN", "SUPER_ADMIN"]),deleteCategoryController);

export default router;

// authMiddleware, inserir nas rotas que precisam de autenticação