import { Router } from 'express';
const router: Router = Router();

import { signup, signin, profilesById, profiles } from '../controllers/auth.controller';

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.get('/users', profiles);
router.get('/users/:id', profilesById);
// router.put('/users/:id', putUserById);
// router.delete('/users/:id', deleteUserById);

export default router;