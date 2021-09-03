import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario as UserEty } from '../entity/user.entity';
import { Rol as RoleEty } from '../entity/role.entity';
import { User } from 'interfaces/User.interface';
import { Role } from '../interfaces/Role.interface';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;


export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { usuario, password, nombres, apellidos, code } = req.body;

        let user: User = {
            usuario,
            password: await encryptPassword(password),
            nombres,
            apellidos
        }
        let role: Role | undefined;

        if (await existUser(usuario)) return res.status(400).json({ message: `Error el nombre de usuario ya esta en uso` });

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

        const newUser = getRepository(UserEty).create(user);
        const results = await getRepository(UserEty).save(newUser);

        // return res.header('Authorization', await signToken(results.id)).status(200).json({ message: `Usuario ${usuario} registrado con éxito` });

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

        const userFound: User | undefined = await getRepository(UserEty).findOne({
            select: ["id", "usuario", "password"], where: {
                usuario
            },
            relations: ["rol"]
        });

        if (!userFound) return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });

        const matchPassword = await comparePassword(password, userFound.password)
        if (!matchPassword) return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });

        // return res.header('Authorization', await signToken(userFound.id)).status(200).json({ id: userFound.id, usuario: userFound.usuario });
        return res.status(200).json({ usuario: userFound.usuario, rol: userFound.rol?.nombre, token: await signToken(userFound.id) });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al iniciar sesión` });
    }
}


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users: User[] = await getRepository(UserEty).find({
            select: ["id", "usuario", "nombres", "apellidos", "estado", "fechaCreacion", "fechaActualizacion"],
            relations: ["rol"],
        });

        return res.status(200).json(users);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los usuarios` });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userFound: User | undefined = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "usuario", "nombres", "apellidos", "estado", "fechaCreacion", 'fechaActualizacion'],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener al usuario` });
    }
}

export const getUserNow = async (req: Request, res: Response): Promise<Response> => {    
    try {
        const id: number = req.userId;
        // console.log(id);

        const userFound: User | undefined = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "usuario", "nombres", "apellidos", "estado", "fechaCreacion", 'fechaActualizacion'],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener al usuario actual` });
    }
}

export const changeStateById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userFound = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "usuario", "nombres", "apellidos", "estado"],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        const newUser = {
            id: userFound.id,
            usuario: userFound.usuario,
            nombres: userFound.nombres,
            apellidos: userFound.apellidos,
            estado: userFound.estado ? false : true,
        } as User;

        getRepository(UserEty).merge(userFound, newUser);
        await getRepository(UserEty).save(userFound);
        return res.status(200).json({ message: `Se actualizo el estado del usuario ${userFound.usuario}` });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al cambiar el estado del usuario` });
    }
}

export const putUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { nombres, apellidos } = req.body;

        const userFound = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "usuario", "nombres", "apellidos",],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        const newUser = {
            id: userFound.id,
            usuario: userFound.usuario,
            nombres: nombres || userFound.nombres,
            apellidos: apellidos || userFound.apellidos,
        } as User;


        getRepository(UserEty).merge(userFound, newUser);
        await getRepository(UserEty).save(userFound);
        return res.status(200).json({ message: `Se actualizo los datos del usuario ${userFound.usuario}` });
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar los datos del usuario` });
    }
}

export const putUserPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id: number = req.userId;
        const { password, newPassword } = req.body;

        const userFound = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "password"]
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });
        // console.log(userFound);

        const matchPassword = await comparePassword(password, userFound.password)
        if (!matchPassword) return res.status(400).json({ message: `La contraseña actual es incorrecta` });

        const newUser = {
            id: userFound.id,
            password: await encryptPassword(newPassword),
        } as User;

        getRepository(UserEty).merge(userFound, newUser);
        await getRepository(UserEty).save(userFound);
        return res.status(200).json({ message: `Se actualizo la contraseña` });
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar la contraseña` });
    }
}

export const putUserPasswordAdminById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const userFound = await getRepository(UserEty).findOne(
            id, {
            select: ["id", "usuario", "password"],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        const newUser = {
            id: userFound.id,
            password: await encryptPassword(newPassword),
        } as User;

        getRepository(UserEty).merge(userFound, newUser);
        await getRepository(UserEty).save(userFound);
        return res.status(200).json({ message: `Se actualizo la contraseña del usuario ${userFound.usuario}` });
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al actualizar la contraseña del usuario` });

    }
}

export const deleteUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const results = await getRepository(UserEty).delete(id);

        return res.status(200).json({ message: `Usuario eliminado con éxito` });
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al eliminar al usuario` });
    }
}


async function existUser(usuario: string): Promise<boolean> {
    const userFound: User | undefined = await getRepository(UserEty).findOne({
        select: ["usuario"],
        where: {
            usuario
        },
    });

    return userFound ? true : false;
}

async function encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
}

async function comparePassword(receivedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compareSync(receivedPassword, password);
}

async function signToken(id: number | undefined): Promise<string> {
    const token: string = await jwt.sign({ id }, process.env.SECRET_KEY || 'SinTokenValido-1', {
        expiresIn: "1d",
    });

    return token;
}