import { Rol as RoleEty } from "../entity/role.entity";
import { getRepository } from "typeorm";
import { Role } from "../interfaces/Role.interface";

export const createRoles = async () => {
    try {
        //* Buscamos la cantidad de roles
        const count = await getRepository(RoleEty).find();

        //? En caso de existir los roles no se hace nada
        if (count.length > 0) return;

        const roles: Role[] = [
            {
                nombre: "Administrador",
            },
            {
                nombre: "Moderador",
            },
        ];

        //? En caso de no existir creamos el rol de administrador y moderador
        const newRoleAdmin = getRepository(RoleEty).create(roles[0]);
        const newRoleModerator = getRepository(RoleEty).create(roles[1]);

        //* Guardamos los roles
        await getRepository(RoleEty).save(newRoleAdmin);
        await getRepository(RoleEty).save(newRoleModerator);

        console.log("Roles creados con éxito");
    } catch (error) {
        console.error(error);
    }
};
