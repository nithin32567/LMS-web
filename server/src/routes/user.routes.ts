import { Router, Request, Response, NextFunction } from 'express';
import { getUsers } from '../controllers/users/user.controller.ts';
import authenticate from '../middleware/authenticate.ts';

const router = Router();

router.get('/', authenticate([]), (req: Request, res: Response, next: NextFunction) => {
  console.log('GET /api/users route hit');
  next();
}, getUsers);

export default router;


