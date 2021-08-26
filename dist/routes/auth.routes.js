"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const auth_controller_1 = require("../controllers/auth.controller");
const verifyTokenAndRol_1 = require("../libs/verifyTokenAndRol");
router.post('/auth/signup', [verifyTokenAndRol_1.verifyRolAdminSignup, auth_controller_1.signup]);
router.post('/auth/signin', auth_controller_1.signin);
router.get('/users', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.getUsers]);
router.get('/users/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.getUserById]);
router.patch('/users/state/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.changeStateById]);
router.put('/users/update/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.putUserById]);
router.put('/users/password-update/:id', [verifyTokenAndRol_1.tokenValidation, auth_controller_1.putUserPasswordById]);
router.put('/users/password-admin-update/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.putUserPasswordAdminById]);
router.delete('/users/delete/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.deleteUserById]);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map