"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.signin = exports.signup = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const role_entity_1 = require("../entity/role.entity");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, password, nombres, apellidos, code } = req.body;
        let user = {
            usuario,
            password,
            nombres,
            apellidos
        };
        let role;
        if (code === process.env.ADMIN_CODE) {
            role = yield typeorm_1.getRepository(role_entity_1.Rol).findOne({
                where: {
                    nombre: 'Administrador'
                }
            });
            user.rol = role;
        }
        else {
            role = yield typeorm_1.getRepository(role_entity_1.Rol).findOne({
                where: {
                    nombre: 'Moderador'
                }
            });
            user.rol = role;
        }
        //TODO Falta encryptar la contraseña y crear jwt
        const newUser = typeorm_1.getRepository(user_entity_1.Usuario).create(user);
        yield typeorm_1.getRepository(user_entity_1.Usuario).save(newUser);
        return res.status(200).json({ message: `Usuario ${usuario} registrado con éxito` });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY")
            return res.status(400).json({ error, message: `Error el nombre de usuario ya esta en uso` });
        console.log(error);
        return res.status(400).json({ error, message: `Error al registrar al usuario` });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, password } = req.body;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).find({
            select: ["usuario"], where: {
                usuario
            }
        });
        if (userFound.length < 1)
            return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });
        return res.status(200).json(userFound);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al iniciar sesión` });
    }
});
exports.signin = signin;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TODO Falta crear Inner Join con Rol
        const users = yield typeorm_1.getRepository(user_entity_1.Usuario).find({ select: ["id", "usuario", "nombres", "apellidos"] });
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los usuarios` });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //TODO Falta crear Inner Join con Rol
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, { select: ["id", "usuario", "nombres", "apellidos"] });
        if (!userFound)
            return res.status(404).json({ message: `Usuario no encontrado` });
        return res.status(200).json(userFound);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener al usuario` });
    }
});
exports.getUserById = getUserById;
//# sourceMappingURL=auth.controller.js.map