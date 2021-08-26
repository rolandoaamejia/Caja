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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.putUserPasswordAdminById = exports.putUserPasswordById = exports.putUserById = exports.changeStateById = exports.getUserById = exports.getUsers = exports.signin = exports.signup = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const role_entity_1 = require("../entity/role.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, password, nombres, apellidos, code } = req.body;
        let user = {
            usuario,
            password: yield encryptPassword(password),
            nombres,
            apellidos
        };
        let role;
        if (yield existUser(usuario))
            return res.status(400).json({ message: `Error el nombre de usuario ya esta en uso` });
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
        const newUser = typeorm_1.getRepository(user_entity_1.Usuario).create(user);
        const results = yield typeorm_1.getRepository(user_entity_1.Usuario).save(newUser);
        return res.header('Authorization', yield signToken(results.id)).status(200).json({ message: `Usuario ${usuario} registrado con éxito` });
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
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne({
            select: ["id", "usuario", "password"], where: {
                usuario
            }
        });
        if (!userFound)
            return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });
        const matchPassword = yield comparePassword(password, userFound.password);
        if (!matchPassword)
            return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });
        return res.header('Authorization', yield signToken(userFound.id)).status(200).json({ id: userFound.id, usuario: userFound.usuario });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al iniciar sesión` });
    }
});
exports.signin = signin;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield typeorm_1.getRepository(user_entity_1.Usuario).find({
            select: ["id", "usuario", "nombres", "apellidos", "estado", "fechaCreacion", "fechaActualizacion"],
            relations: ["rol"],
        });
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
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, {
            select: ["id", "usuario", "nombres", "apellidos", "estado", "fechaCreacion", 'fechaActualizacion'],
            relations: ["rol"],
        });
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
const changeStateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, {
            select: ["id", "usuario", "nombres", "apellidos", "estado"],
            relations: ["rol"],
        });
        if (!userFound)
            return res.status(404).json({ message: `Usuario no encontrado` });
        const newUser = {
            id: userFound.id,
            usuario: userFound.usuario,
            nombres: userFound.nombres,
            apellidos: userFound.apellidos,
            estado: userFound.estado ? false : true,
        };
        typeorm_1.getRepository(user_entity_1.Usuario).merge(userFound, newUser);
        yield typeorm_1.getRepository(user_entity_1.Usuario).save(userFound);
        return res.status(200).json({ message: `Se actualizo el estado del usuario ${userFound.usuario}` });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al cambiar el estado del usuario` });
    }
});
exports.changeStateById = changeStateById;
const putUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombres, apellidos } = req.body;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, {
            select: ["id", "usuario", "nombres", "apellidos",],
            relations: ["rol"],
        });
        if (!userFound)
            return res.status(404).json({ message: `Usuario no encontrado` });
        const newUser = {
            id: userFound.id,
            usuario: userFound.usuario,
            nombres: nombres || userFound.nombres,
            apellidos: apellidos || userFound.apellidos,
        };
        typeorm_1.getRepository(user_entity_1.Usuario).merge(userFound, newUser);
        yield typeorm_1.getRepository(user_entity_1.Usuario).save(userFound);
        return res.status(200).json({ message: `Se actualizo los datos del usuario ${userFound.usuario}` });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar los datos del usuario` });
    }
});
exports.putUserById = putUserById;
const putUserPasswordById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password, newPassword } = req.body;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, {
            select: ["id", "password"]
        });
        if (!userFound)
            return res.status(404).json({ message: `Usuario no encontrado` });
        console.log(userFound);
        const matchPassword = yield comparePassword(password, userFound.password);
        if (!matchPassword)
            return res.status(400).json({ message: `La contraseña actual es incorrecta` });
        const newUser = {
            id: userFound.id,
            password: yield encryptPassword(newPassword),
        };
        typeorm_1.getRepository(user_entity_1.Usuario).merge(userFound, newUser);
        yield typeorm_1.getRepository(user_entity_1.Usuario).save(userFound);
        return res.status(200).json({ message: `Se actualizo la contraseña` });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar la contraseña` });
    }
});
exports.putUserPasswordById = putUserPasswordById;
const putUserPasswordAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id, {
            select: ["id", "usuario", "password"],
            relations: ["rol"],
        });
        if (!userFound)
            return res.status(404).json({ message: `Usuario no encontrado` });
        const newUser = {
            id: userFound.id,
            password: yield encryptPassword(newPassword),
        };
        typeorm_1.getRepository(user_entity_1.Usuario).merge(userFound, newUser);
        yield typeorm_1.getRepository(user_entity_1.Usuario).save(userFound);
        return res.status(200).json({ message: `Se actualizo la contraseña del usuario ${userFound.usuario}` });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar la contraseña del usuario` });
    }
});
exports.putUserPasswordAdminById = putUserPasswordAdminById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const results = yield typeorm_1.getRepository(user_entity_1.Usuario).delete(id);
        return res.status(200).json({ message: `Usuario eliminado con éxito` });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error, message: `Error al eliminar al usuario` });
    }
});
exports.deleteUserById = deleteUserById;
function existUser(usuario) {
    return __awaiter(this, void 0, void 0, function* () {
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne({
            select: ["usuario"],
            where: {
                usuario
            },
        });
        return userFound ? true : false;
    });
}
function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
function comparePassword(receivedPassword, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compareSync(receivedPassword, password);
    });
}
function signToken(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield jsonwebtoken_1.default.sign({ id }, process.env.SECRET_KEY || 'SinTokenValido-1', {
            expiresIn: "1d",
        });
        return token;
    });
}
//# sourceMappingURL=auth.controller.js.map