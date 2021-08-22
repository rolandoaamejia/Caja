"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const auth_controller_1 = require("../controllers/auth.controller");
router.post('/auth/signup', auth_controller_1.signup);
router.post('/auth/signin', auth_controller_1.signin);
router.get('/users', auth_controller_1.profiles);
router.get('/users/:id', auth_controller_1.profilesById);
// router.put('/users/:id', putUserById);
// router.delete('/users/:id', deleteUserById);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map