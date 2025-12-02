import { Router } from 'express';
import {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  updateModuleOrder,
  updateModuleOrderBulk,
} from '../controllers/course/module-lessson.controller.ts';
import authenticate from '../middleware/authenticate.ts';

const router = Router();

router.post('/', authenticate(['admin', 'instructor']), createModule);

router.get('/course/:courseId', authenticate([]), getModulesByCourse);

router.put('/:moduleId', authenticate(['admin', 'instructor']), updateModule);

router.delete('/:moduleId', authenticate(['admin', 'instructor']), deleteModule);

router.put('/:moduleId/order', authenticate(['admin', 'instructor']), updateModuleOrder);

router.put('/order/bulk', authenticate(['admin', 'instructor']), updateModuleOrderBulk);

export default router;


