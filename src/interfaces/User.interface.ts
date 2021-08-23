import { Role } from './Role.interface';

export interface User {
    id?: number;
    usuario: string;
    password: string;
    nombres: string;
    apellidos: string;
    rol?: Role;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}