import { Router } from 'express';
import {
  createCourse,
  updateCourse,
  getCourses,
  getCourseById,
  deleteCourse,
  getCourseByOwner,
} from '../controllers/course/course.controller.ts';
import authenticate from '../middleware/authenticate.ts';
import upload from '../config/multer.config.ts';

const router = Router();

router.post(
  '/',
  authenticate(['admin', 'instructor']),
  upload.single('image'),
  createCourse
);

router.put(
  '/:id',
  authenticate(['admin', 'instructor']),
  upload.single('image'),
  updateCourse
);

router.get('/', authenticate([]), getCourses);

router.get('/owner/my-courses', authenticate(['instructor']), getCourseByOwner);

router.get('/:id', authenticate([]), getCourseById);

router.delete('/:id', authenticate(['admin', 'instructor']), deleteCourse);

export default router;

