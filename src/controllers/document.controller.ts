import e, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { DocumentoConciliacion as DocConEty } from '../entity/documentCon.entity';
import { DocumentoArqueo as DocArqEty } from '../entity/documentArq.entity';
import { Usuario as UserEty } from '../entity/user.entity';


import { DocumentCon } from '../interfaces/DocumentCon.interface';
import { User } from 'interfaces/User.interface'

import path from 'path';
import fs, { unlink } from 'fs-extra';
import { DocumentArq } from '../interfaces/DocumentArq.interface';


// #region //*Documento conciliación
export const postUploadDocumentCon = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) return res.status(400).json({ message: `Error solo se aceptan archivos de tipo xlsx` });
        const { cuenta, banco, fechaDocumento } = req.body;

        const documentDate = (new Date()).toISOString().split('T');
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

export const deleteDocumentCon = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocConEty).findOne({
            where: {
                usuario: id,
                codigo
            }
        }) as DocumentCon;

        await deleteDocumentByName(documentFound.documento);

        const results = await getRepository(DocConEty).createQueryBuilder()
            .delete()
            .from(DocConEty)
            .where("usuarioId = :usuario", { usuario: id })
            .andWhere("codigo = :codigo", { codigo })
            .execute()

        // if(results.affected)

        return res.status(200).json({ message: `Documento conciliación cuenta de cheques eliminado con éxito` });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al eliminar el documento conciliación cuenta de cheques` });
    }
}

export const getDocumentsCon = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { start, end } = req.query;

        const documentsFound = await getRepository(DocConEty).createQueryBuilder()
            .select("id, codigo, cuenta, banco, fechaDocumento, fechaCreacion, fechaActualizacion")
            .where("fechaActualizacion >= :start", { start })
            .andWhere("fechaActualizacion <= :end", { end })
            .andWhere("usuarioId = :usuario", { usuario: req.userId })
            .execute() as DocumentCon[];

        return res.status(200).json(documentsFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los documentos conciliación cuenta de cheques` });
    }
}

export const getDocumentsConAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { start, end } = req.query;

        const documentsFound = await getRepository(DocConEty).createQueryBuilder()
            .select("id, codigo, cuenta, banco, fechaDocumento, fechaCreacion, fechaActualizacion")
            .where("fechaActualizacion >= :start", { start })
            .andWhere("fechaActualizacion <= :end", { end })
            .andWhere("usuarioId = :usuario", { usuario: id })
            .execute() as DocumentCon[];

        return res.status(200).json(documentsFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los documentos conciliación cuenta de cheques` });
    }
}

export const getDocumentConByCode = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { codigo } = req.params;

        const documentFound = await getRepository(DocConEty).findOne({
            select: ["id", "codigo", "cuenta", "banco", "fechaDocumento", "fechaCreacion", "fechaActualizacion"],
            where: {
                usuario: req.userId,
                codigo
            }
        }) as DocConEty;

        if (!documentFound) return res.status(400).json({ message: `Documento conciliación cuenta de cheques no encontrado` });

        return res.status(200).json(documentFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento conciliación cuenta de cheques` });
    }
}

export const getDocumentConByCodeAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocConEty).findOne({
            select: ["id", "codigo", "cuenta", "banco", "fechaDocumento", "fechaCreacion", "fechaActualizacion"],
            where: {
                usuario: id,
                codigo
            }
        }) as DocConEty;

        if (!documentFound) return res.status(400).json({ message: `Documento conciliación cuenta de cheques no encontrado` });

        return res.status(200).json(documentFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento conciliación cuenta de cheques` });
    }
}

export const getDocumentXLSXConByCode = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { codigo } = req.params;

        const documentFound = await getRepository(DocConEty).findOne({
            select: ["id", "documento"],
            where: {
                usuario: req.userId,
                codigo
            }
        }) as DocConEty;

        if (!documentFound) return res.status(400).json({ message: `Documento conciliación cuenta de cheques no encontrado` });

        const fileFound = fs.readFileSync(path.resolve(`.${documentFound.documento}`))

        return res.status(200).send(fileFound)
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento conciliación cuenta de cheques` });
    }
}

export const getDocumentXLSXConByCodeAdmin = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocConEty).findOne({
            select: ["id", "documento"],
            where: {
                usuario: id,
                codigo
            }
        }) as DocConEty;

        if (!documentFound) return res.status(400).json({ message: `Documento conciliación cuenta de cheques no encontrado` });

        const fileFound = fs.readFileSync(path.resolve(`.${documentFound.documento}`))
        // const documentDate = (new Date()).toISOString().split('T');

        return res.status(200).send(fileFound)
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento conciliación cuenta de cheques` });
    }
}

//#endregion


// #region //*Documento arqueo

export const postUploadDocumentArq = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) return res.status(400).json({ message: `Error solo se aceptan archivos de tipo xlsx` });
        const { cuenta, banco, oficina, responsable, fechaDocumento } = req.body;

        const documentDate = (new Date()).toISOString().split('T');
        const month: string = documentDate[0].split('-')[1];
        const year: string = documentDate[0].split('-')[0];
        const codigo: string = `arq-00${month}-${year}`;

        const existDocumentArq = await existDocumentArqByCode(codigo, req.userId);

        if (existDocumentArq) {

            await putUploadDocumentArq(req, req.file.filename, codigo, req.userId);
            return res.status(200).json({ message: `Documento de arqueo fondos reintegrables actualizado con éxito` });
        } else {

            const usuario = await getUser(req.userId) as User;

            const documentArq: DocumentArq = {
                codigo,
                cuenta,
                banco,
                oficina,
                responsable,
                fechaDocumento: (new Date(fechaDocumento)),
                documento: `/uploads/${req.file.filename}`,
                usuario
            };

            const newDocument: DocumentCon = getRepository(DocArqEty).create(documentArq);
            await getRepository(DocArqEty).save(newDocument);

            return res.status(200).json({ message: `Documento de arqueo fondos reintegrables subido con éxito` });
        }

    } catch (error) {
        console.log(error);
        await deleteDocument(req);

        return res.status(400).json({ error, message: `Error en subir el arqueo fondos reintegrables cuenta de cheques` });
    }
}

async function putUploadDocumentArq(req: Request, filename: string, codigo: string, userId: number): Promise<void> {
    try {
        const { cuenta, banco, oficina, responsable, fechaDocumento } = req.body;

        const documentFound = await getRepository(DocArqEty).find({
            where: {
                codigo,
                "usuario": userId
            }
        })

        const documentArq: DocumentArq = {
            codigo,
            cuenta,
            banco,
            oficina,
            responsable,
            fechaDocumento: (new Date(fechaDocumento)),
            documento: `/uploads/${filename}`,
        };
        getRepository(DocArqEty).merge(documentFound[0], documentArq);
        await getRepository(DocArqEty).save(documentFound);
    } catch (error) {
        console.log(error);
        await deleteDocument(req);
    }
}

export const deleteDocumentArq = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocArqEty).findOne({
            where: {
                usuario: id,
                codigo
            }
        }) as DocumentArq;
        

        await deleteDocumentByName(documentFound.documento);

        const results = await getRepository(DocArqEty).createQueryBuilder()
            .delete()
            .from(DocArqEty)
            .where("usuarioId = :usuario", { usuario: id })
            .andWhere("codigo = :codigo", { codigo })
            .execute()

        // if(results.affected)

        return res.status(200).json({ message: `Documento arqueo fondos reintegrables eliminado con éxito` });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al eliminar el documento arqueo fondos reintegrables` });
    }
}

export const getDocumentsArq = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { start, end } = req.query;

        const documentsFound = await getRepository(DocArqEty).createQueryBuilder()
            .select("id, codigo, cuenta, banco, oficina, responsable, fechaDocumento, fechaCreacion, fechaActualizacion")
            .where("fechaActualizacion >= :start", { start })
            .andWhere("fechaActualizacion <= :end", { end })
            .andWhere("usuarioId = :usuario", { usuario: req.userId })
            .execute() as DocumentArq[];

        return res.status(200).json(documentsFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los documentos arqueo fondos reintegrables` });
    }
}

export const getDocumentsArqAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { start, end } = req.query;

        const documentsFound = await getRepository(DocArqEty).createQueryBuilder()
            .select("id, codigo, cuenta, banco, oficina, responsable, fechaDocumento, fechaCreacion, fechaActualizacion")
            .where("fechaActualizacion >= :start", { start })
            .andWhere("fechaActualizacion <= :end", { end })
            .andWhere("usuarioId = :usuario", { usuario: id })
            .execute() as DocumentArq[];

        return res.status(200).json(documentsFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener los documentos arqueo fondos reintegrables` });
    }
}

export const getDocumentArqByCode = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { codigo } = req.params;

        const documentFound = await getRepository(DocArqEty).findOne({
            select: ["id", "codigo", "cuenta", "banco", "oficina", "responsable", "fechaDocumento", "fechaCreacion", "fechaActualizacion"],
            where: {
                usuario: req.userId,
                codigo
            }
        }) as DocArqEty;

        if (!documentFound) return res.status(400).json({ message: `Documento arqueo fondos reintegrables no encontrado` });

        return res.status(200).json(documentFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento arqueo fondos reintegrables` });
    }
}

export const getDocumentArqByCodeAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocArqEty).findOne({
            select: ["id", "codigo", "cuenta", "banco", "oficina", "responsable", "fechaDocumento", "fechaCreacion", "fechaActualizacion"],
            where: {
                usuario: id,
                codigo
            }
        }) as DocArqEty;

        if (!documentFound) return res.status(400).json({ message: `Documento arqueo fondos reintegrables no encontrado` });

        return res.status(200).json(documentFound);
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento arqueo fondos reintegrables` });
    }
}

export const getDocumentXLSXArqByCode = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { codigo } = req.params;

        const documentFound = await getRepository(DocArqEty).findOne({
            select: ["id", "documento"],
            where: {
                usuario: req.userId,
                codigo
            }
        }) as DocArqEty;

        if (!documentFound) return res.status(400).json({ message: `Documento arqueo fondos reintegrables no encontrado` });

        const fileFound = fs.readFileSync(path.resolve(`.${documentFound.documento}`))

        return res.status(200).send(fileFound)
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento arqueo fondos reintegrables` });
    }
}

export const getDocumentXLSXArqByCodeAdmin = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { id, codigo } = req.params;

        const documentFound = await getRepository(DocArqEty).findOne({
            select: ["id", "documento"],
            where: {
                usuario: id,
                codigo
            }
        }) as DocArqEty;

        if (!documentFound) return res.status(400).json({ message: `Documento arqueo fondos reintegrables no encontrado` });

        const fileFound = fs.readFileSync(path.resolve(`.${documentFound.documento}`))
        // const documentDate = (new Date()).toISOString().split('T');

        return res.status(200).send(fileFound)
    } catch (error) {

        console.log(error);
        return res.status(400).json({ error, message: `Error al obtener el documento arqueo fondos reintegrables` });
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

async function existDocumentArqByCode(codigo: string, userId: number): Promise<boolean> {
    const documentFound = await getRepository(DocArqEty).find({
        where: {
            codigo,
            "usuario": userId
        }
    }) as DocumentArq[];

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