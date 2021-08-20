import express, { Application } from 'express';
import { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import "reflect-metadata";

import { createRoles } from './libs/initialSetup.lib';


import authRoutes from './routes/auth.routes';


const app: Application = express();

//* Settings

app.set('port', 3000);

//* Middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

//* Routes
app.use('/api', authRoutes);

app.use((req: Request, res: Response): Response => {
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

