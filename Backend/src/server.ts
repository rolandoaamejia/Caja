import express, { Application } from 'express';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import "reflect-metadata";

import { createRoles } from './libs/initialSetup.lib';


import authRoutes from './routes/auth.routes';
import docRoutes from './routes/document.routes';


dotenv.config();

const app: Application = express();

//* Settings

app.set('port', process.env.PORT || 3000);

//* Middlewares
app.use(helmet());

const corsOptions = {
    origin: `${process.env.HOST_FRONTEND}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//* Ruta publica para los archivos
app.use('/public', express.static(path.resolve('public')));

//* Routes
app.use('/api', authRoutes);
app.use('/api/doc', docRoutes);

app.use((req: Request, res: Response, next: NextFunction): Response => {
    try {
        return res.json({ message: "No se encontró la ruta solicitada" });
    } catch (error) {
        return res.json(error);
    }
});


//? Inicia la conexión y importa el archivo ormconfig.json
createConnection().then((res) => {
    //? Verificamos los roles actuales o los creamos
    createRoles();
}, (err) => console.error(err));


export default app;

