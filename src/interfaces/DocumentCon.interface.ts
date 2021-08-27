import { User } from './User.interface';

export interface DocumentCon {
    id?: number;
    codigo: string;
    cuenta: string;
    banco: string;
    fechaDocumento: Date;
    documento: string;
    usuario?: User;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}