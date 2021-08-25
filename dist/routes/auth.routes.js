"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const auth_controller_1 = require("../controllers/auth.controller");
const verifyTokenAndRol_1 = require("../libs/verifyTokenAndRol");
router.post('/auth/signup', [verifyTokenAndRol_1.verifyRolAdminSignup, auth_controller_1.signup]);
router.post('/auth/signin', auth_controller_1.signin);
// router.put('/users/:id', putUserById);
// router.delete('/users/:id', deleteUserById);
router.get('/users', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.getUsers]);
router.get('/users/:id', [verifyTokenAndRol_1.verifyRolAdmin, auth_controller_1.getUserById]);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map