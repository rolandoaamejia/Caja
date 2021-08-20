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
exports.profilesById = exports.profiles = exports.signin = exports.signup = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
});
exports.signin = signin;
const profiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield typeorm_1.getRepository(user_entity_1.Usuario).find();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
});
exports.profiles = profiles;
const profilesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userFound = yield typeorm_1.getRepository(user_entity_1.Usuario).findOne(id);
        if (!userFound)
            return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json(userFound);
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
});
exports.profilesById = profilesById;
// export const postUsers = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const newUser = getRepository(User).create(req.body);
//         const results = await getRepository(User).save(newUser);
//         return res.status(200).json(results);
//     } catch (error) {
//         console.log(error);
//         return res.json(error)
//     }
// }
// export const putUserById = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const { id } = req.params;
//         const userFound = await getRepository(User).findOne(id);
//         if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });
//         getRepository(User).merge(userFound, req.body);
//         const results = await getRepository(User).save(userFound);
//         return res.status(200).json(results);
//     } catch (error) {
//         console.log(error);
//         return res.json(error)
//     }
// }
// export const deleteUserById = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const { id } = req.params;
//         const results = await getRepository(User).delete(id);
//         return res.status(200).json(results);
//     } catch (error) {
//         console.log(error);
//         return res.json(error)
//     }
// }
//# sourceMappingURL=auth.controller.js.map