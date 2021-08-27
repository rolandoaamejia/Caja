import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { DocumentoConciliacion as DocConEty } from '../entity/documentCon.entity';
import { Usuario as UserEty } from '../entity/user.entity';


import { DocumentCon } from '../interfaces/DocumentCon.interface';
import { User } from 'interfaces/User.interface';
import path from 'path';
import fs, { unlink } from 'fs-extra';


// #region //*Documento conciliación
export const postUploadDocumentCon = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) return res.status(400).json({ message: `Error solo se aceptan archivos de tipo xlsx` });
        const { cuenta, banco, fechaDocumento } = req.body;

        const documentDate = (new Date(fechaDocumento)).toISOString().split('T');
        const month: string = documentDate[0].split('-')[1];
        const year: string = documentDate[0].split('-')[0];
        const codigo: string = `con-00${month}-${year}`;

        const existDocumentCon = await existDocumentConByCode(codigo, req.userId);

        if (existDocumentCon) {

            await putUploadDocumentCon(req, req.file.filename, codigo, req.userId);
            return res.status(200).json({ message: `Documento de conciliación cuenta de cheques actualizado con éxito` });
        } else {

            const usuario = await getUser(req.userId) as User;

            const documentCon: DocumentCon = {
                codigo,
                cuenta,
                banco,
                fechaDocumento: (new Date(fechaDocumento)),
                documento: `/uploads/${req.file.filename}`,
                usuario
            };

            const newDocument: DocumentCon = getRepository(DocConEty).create(documentCon);
            await getRepository(DocConEty).save(newDocument);

            return res.status(200).json({ message: `Documento de conciliación cuenta de cheques subido con éxito` });
        }

    } catch (error) {
        console.log(error);
        await deleteDocument(req);

        return res.status(400).json({ error, message: `Error en subir el documento conciliación cuenta de cheques` });
    }
}

async function putUploadDocumentCon(req: Request, filename: string, codigo: string, userId: number): Promise<void> {
    try {
        const { cuenta, banco, fechaDocumento } = req.body;

        const documentFound = await getRepository(DocConEty).find({
            where: {
                codigo,
                "usuario": userId
            }
        })

        const documentCon: DocumentCon = {
            codigo,
            cuenta,
            banco,
            fechaDocumento: (new Date(fechaDocumento)),
            documento: `/uploads/${filename}`,
        };
        getRepository(DocConEty).merge(documentFound[0], documentCon);
        await getRepository(DocConEty).save(documentFound);
    } catch (error) {
        console.log(error);
        await deleteDocument(req);
    }
}

export const getDocumentsCon = async (req: Request, res: Response): Promise<Response> => {
    try {
        const documentsFound = await getRepository(DocConEty).find({
            where: {
                usuario: req.userId
            }
        }) as DocumentCon[];

        return res.status(200).json(documentsFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los documentos conciliación cuenta de cheques` });
    }
}

//#endregion




async function existDocumentConByCode(codigo: string, userId: number): Promise<boolean> {
    const documentFound = await getRepository(DocConEty).find({
        where: {
            codigo,
            "usuario": userId
        }
    }) as DocumentCon[];

    if (documentFound.length >= 1) {
        await deleteDocumentByName(documentFound[0].documento);
    }

    return documentFound.length >= 1 ? true : false;
}

async function getUser(id: number): Promise<User | undefined> {
    const userFound: User | undefined = await getRepository(UserEty).findOne(
        {
            where: {
                id
            }
        }
    );

    return userFound;
}

async function deleteDocument(req: Request): Promise<void> {
    try {
        if (req.file) {
            const { filename } = req.file;
            if (fs.existsSync(path.resolve(`./uploads/${filename}`))) {
                await unlink(path.resolve(`./uploads/${filename}`));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteDocumentByName(documento: string): Promise<void> {
    try {
        if (fs.existsSync(path.resolve(`.${documento}`))) {

            await unlink(path.resolve(`.${documento}`));
        }
    } catch (error) {
        console.log(error);
    }
}