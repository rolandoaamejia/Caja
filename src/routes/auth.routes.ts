import { Router } from 'express';
const router: Router = Router();

import { signup, signin, getUsers, getUserById, changeStateById } from '../controllers/auth.controller';
import { tokenValidation, verifyRolAdmin, verifyRolAdminSignup } from '../libs/verifyTokenAndRol';

router.post('/auth/signup', [verifyRolAdminSignup, signup]);
router.post('/auth/signin', signin);
// router.put('/users/:id', putUserById);
// router.delete('/users/:id', deleteUserById);

router.get('/users', [verifyRolAdmin, getUsers]);
router.get('/users/:id', [verifyRolAdmin, getUserById]);
router.patch('/users/state/:id', [verifyRolAdmin, changeStateById]);

export default router;