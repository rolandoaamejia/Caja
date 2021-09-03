import { User } from './User.interface';

export interface DocumentArq {
    id?: number;
    codigo: string;
    cuenta: string;
    banco: string;
    oficina: string;
    responsable: string;
    fechaDocumento: Date;
    documento: string;
    usuario?: User;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}