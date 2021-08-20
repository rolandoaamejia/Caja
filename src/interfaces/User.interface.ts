export interface User {
    id?: number;
    usuario: string;
    password: string;
    nombres: string;
    apellidos: string;
    idRol?: number;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}