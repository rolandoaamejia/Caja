import { Rol } from './rol';
export interface Usuario {
    id?: number;
    usuario: string;
    password: string;
    nombres?: string;
    apellidos?: string;
    estado?: boolean;
    rol?: Rol;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
