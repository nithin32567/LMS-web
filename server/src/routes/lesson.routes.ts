import { Router } from 'express';
import {
  createLesson,
  getLessonsByModule,
  updateLesson,
  deleteLesson,
  updateLessonOrder,
  updateLessonOrderBulk,
  assignLessonToModule,
} from '../controllers/course/module-lessson.controller.ts';
import authenticate from '../middleware/authenticate.ts';

const router = Router();

router.post('/', authenticate(['admin', 'instructor']), createLesson);

router.get('/module/:moduleId', authenticate([]), getLessonsByModule);

router.put('/:lessonId', authenticate(['admin', 'instructor']), updateLesson);

router.delete('/:lessonId', authenticate(['admin', 'instructor']), deleteLesson);

router.put('/:lessonId/order', authenticate(['admin', 'instructor']), updateLessonOrder);

router.put('/order/bulk', authenticate(['admin', 'instructor']), updateLessonOrderBulk);

router.put('/:lessonId/assign/:moduleId', authenticate(['admin', 'instructor']), assignLessonToModule);

export default router;


