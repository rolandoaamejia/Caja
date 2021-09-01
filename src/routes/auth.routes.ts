import { Router } from 'express';
const router: Router = Router();

import { signup, signin, getUsers, getUserById, changeStateById, putUserById, putUserPasswordById, putUserPasswordAdminById, deleteUserById } from '../controllers/auth.controller';
import { tokenValidation, verifyRolAdmin, verifyRolAdminSignup } from '../libs/verifyTokenAndRol';

router.post('/auth/signin', signin);

router.post('/users/signup', [verifyRolAdminSignup, signup]);
router.get('/users', [verifyRolAdmin, getUsers]);
router.get('/users/:id', [verifyRolAdmin, getUserById]);

router.patch('/users/state/:id', [verifyRolAdmin, changeStateById]);
router.put('/users/update/:id', [verifyRolAdmin, putUserById]);

router.put('/users/password-update/:id', [verifyRolAdmin, putUserPasswordById]);
router.put('/users/password-admin-update/:id', [verifyRolAdmin, putUserPasswordAdminById]);

router.delete('/users/delete/:id', [verifyRolAdmin, deleteUserById])

export default router;