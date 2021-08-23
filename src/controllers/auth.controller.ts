import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario as UserEty } from '../entity/user.entity';
import { Rol as RoleEty } from '../entity/role.entity';
import { User } from 'interfaces/User.interface';
import { Role } from '../interfaces/Role.interface';


export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { usuario, password, nombres, apellidos, code } = req.body;

        let user: User = {
            usuario,
            password,
            nombres,
            apellidos
        }
        let role: Role | undefined;
        if (code === process.env.ADMIN_CODE) {

            role = await getRepository(RoleEty).findOne({
                where: {
                    nombre: 'Administrador'
                }
            })
            user.rol = role;

        } else {

            role = await getRepository(RoleEty).findOne({
                where: {
                    nombre: 'Moderador'
                }
            })
            user.rol = role;
        }

        //TODO Falta encryptar la contraseña y crear jwt
        const newUser = getRepository(UserEty).create(user);
        await getRepository(UserEty).save(newUser);

        return res.status(200).json({ message: `Usuario ${usuario} registrado con éxito` });
    } catch (error) {

        if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ error, message: `Error el nombre de usuario ya esta en uso` });

        console.log(error);
        return res.status(400).json({ error, message: `Error al registrar al usuario` });
    }
}

export const signin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { usuario, password } = req.body;

        const userFound: User[] = await getRepository(UserEty).find({
            select: ["usuario"], where: {
                usuario
            }
        })

        if (userFound.length < 1) return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al iniciar sesión` });
    }
}


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        //TODO Falta crear Inner Join con Rol
        const users: User[] = await getRepository(UserEty).find({ select: ["id", "usuario", "nombres", "apellidos"] });

        return res.status(200).json(users);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los usuarios` });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        //TODO Falta crear Inner Join con Rol
        const userFound: User | undefined = await getRepository(UserEty).findOne(id, { select: ["id", "usuario", "nombres", "apellidos"] })

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener al usuario` });
    }
}
