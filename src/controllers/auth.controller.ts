import { Request, Response } from 'express';
import { User } from 'interfaces/User.interface';
import { getRepository } from 'typeorm';
import { Usuario as UserEty } from '../entity/user.entity';

export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {

        return res.status(200).json();
    } catch (error) {

        console.log(error);
        return res.json(error)
    }
}

export const signin = async (req: Request, res: Response): Promise<Response> => {
    try {

        return res.status(200).json();
    } catch (error) {

        console.log(error);
        return res.json(error)
    }
}


export const profiles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users: User[] = await getRepository(UserEty).find();


        return res.status(200).json(users);
    } catch (error) {

        console.log(error);
        return res.json(error)
    }
}

export const profilesById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userFound: User | undefined = await getRepository(UserEty).findOne(id)

        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        return res.status(200).json(userFound);
    } catch (error) {

        console.log(error);
        return res.json(error)
    }
}

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

