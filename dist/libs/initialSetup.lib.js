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
exports.createRoles = void 0;
const role_entity_1 = require("../entity/role.entity");
const typeorm_1 = require("typeorm");
const createRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //* Buscamos la cantidad de roles
        const count = yield typeorm_1.getRepository(role_entity_1.Rol).find();
        //? En caso de existir los roles no se hace nada
        if (count.length > 0)
            return;
        const roles = [
            {
                nombre: "Administrador",
            },
            {
                nombre: "Moderador",
            },
        ];
        //? En caso de no existir creamos el rol de administrador y moderador
        const newRoleAdmin = typeorm_1.getRepository(role_entity_1.Rol).create(roles[0]);
        const newRoleModerator = typeorm_1.getRepository(role_entity_1.Rol).create(roles[1]);
        //* Guardamos los roles
        yield typeorm_1.getRepository(role_entity_1.Rol).save(newRoleAdmin);
        yield typeorm_1.getRepository(role_entity_1.Rol).save(newRoleModerator);
        console.log("Roles creados con éxito");
    }
    catch (error) {
        console.error(error);
    }
});
exports.createRoles = createRoles;
//# sourceMappingURL=initialSetup.lib.js.map