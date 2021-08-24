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

        return res.header('Authorization', await signToken(results.id)).status(200).json({ message: `Usuario ${usuario} registrado con éxito` });
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
            }
        });

        if (!userFound) return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });

        if (!comparePassword(password, userFound.password)) return res.status(400).json({ message: `Error el nombre de usuario o contraseña son incorrectos` });

        return res.header('Authorization', await signToken(userFound.id)).status(200).json({ id: userFound.id, usuario: userFound.usuario });
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al iniciar sesión` });
    }
}


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users: User[] = await getRepository(UserEty).find({
            select: ["id", "usuario", "nombres", "apellidos", "fechaCreacion", "fechaActualizacion"],
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
            select: ["id", "usuario", "nombres", "apellidos", "fechaCreacion", 'fechaActualizacion'],
            relations: ["rol"],
        });

        if (!userFound) return res.status(404).json({ message: `Usuario no encontrado` });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener al usuario` });
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
    return await bcrypt.compare(password, receivedPassword);
}

async function signToken(id: number | undefined): Promise<string> {
    const token: string = await jwt.sign({ id }, process.env.SECRET_KEY || 'SinTokenValido-1', {
        expiresIn: "1d",
    });

    return token;
}