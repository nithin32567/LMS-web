import { Router } from 'express';
import {
    createCategory,
    getCategories,
    deleteCategory,
} from '../controllers/course/category.controller.ts';
import authenticate from '../middleware/authenticate.ts';

const router = Router();

router.post('/', authenticate(['admin', 'instructor']), createCategory);

router.get('/', authenticate([]), getCategories);

router.delete('/:id', authenticate(['admin', 'instructor']), deleteCategory);

export default router;

