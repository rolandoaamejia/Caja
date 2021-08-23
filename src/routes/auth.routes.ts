import { Router } from 'express';
const router: Router = Router();

import { signup, signin, getUsers, getUserById } from '../controllers/auth.controller';

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
// router.put('/users/:id', putUserById);
// router.delete('/users/:id', deleteUserById);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

export default router;