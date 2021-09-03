import { signin, signup, getUsers, getUserById, getUserNow, changeStateById, putUserById, putUserPassword, putUserPasswordAdminById, deleteUserById } from '../controllers/auth.controller';
import { Router } from 'express';
import { verifyRolAdminSignup, verifyRolAdmin, tokenValidation } from '../libs/verifyTokenAndRol';
const router: Router = Router();


router.post('/auth/signin', signin);

router.post('/users/signup', [verifyRolAdminSignup, signup]);
router.get('/users', [verifyRolAdmin, getUsers]);
router.get('/users/:id', [verifyRolAdmin, getUserById]);
router.get('/user/now', [tokenValidation, getUserNow]);

router.patch('/users/state/:id', [verifyRolAdmin, changeStateById]);
router.put('/users/update/:id', [verifyRolAdmin, putUserById]);

router.put('/users/password-update', [tokenValidation, putUserPassword]);
router.put('/users/password-admin-update/:id', [verifyRolAdmin, putUserPasswordAdminById]);

router.delete('/users/delete/:id', [verifyRolAdmin, deleteUserById])

export default router;