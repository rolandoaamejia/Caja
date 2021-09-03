import { Usuario } from './usuario';
export interface DocumentCon {
    id?: number;
    codigo: string;
    cuenta: string;
    banco: string;
    fechaDocumento: Date;
    documento: string;
    usuario?: Usuario;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}