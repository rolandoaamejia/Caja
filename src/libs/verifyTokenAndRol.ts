import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { User } from '../interfaces/User.interface';
import { getRepository } from 'typeorm';
import { Usuario as UserEty } from '../entity/user.entity';

interface Payload {
    id: number;
    iat: number;
    exp: number;
}

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.header('Authorization')) return res.status(401).json({ message: `Acceso denegado` });
        const token: string = req.header('Authorization')?.split(" ")[1] || "";
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'SinTokenValido-1') as Payload;

        const userFound = await getRepository(UserEty).findOne({
            select: ["usuario"], where: {
                id: payload.id
            }
        }) as User;

        if (!userFound) return res.status(401).json({ message: `Acceso denegado` });

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: `Acceso denegado token invalido` });
    }
}

export const verifyRolAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.header('Authorization')) return res.status(401).json({ message: `Acceso denegado` });
        const token: string = req.header('Authorization')?.split(" ")[1] || "";
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'SinTokenValido-1') as Payload;
        const userFound = await getRepository(UserEty).findOne(payload.id, {
            select: ["usuario"],
            relations: ["rol"]
        }) as User;

        if (!userFound) return res.status(401).json({ message: `Acceso denegado` });

        const rol: string | undefined = userFound["rol"]?.nombre;

        if (rol !== "Administrador") return res.status(401).json({ message: `Acceso denegado se necesitan permisos de administrador` });

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: `Acceso denegado token invalido` });
    }
}

export const verifyRolAdminSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;
        
        if (code === process.env.ADMIN_CODE) return next();

        if (!req.header('Authorization')) return res.status(401).json({ message: `Acceso denegado` });
        const token: string = req.header('Authorization')?.split(" ")[1] || "";
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'SinTokenValido-1') as Payload;
        const userFound = await getRepository(UserEty).findOne(payload.id, {
            select: ["usuario"],
            relations: ["rol"]
        }) as User;

        if (!userFound) return res.status(401).json({ message: `Acceso denegado` });

        const rol: string | undefined = userFound["rol"]?.nombre;

        if (rol !== "Administrador") return res.status(401).json({ message: `Acceso denegado se necesitan permisos de administrador` });

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: `Acceso denegado token invalido` });
    }
}