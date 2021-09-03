import { Usuario } from './usuario';

export interface DocumentArq {
    id?: number;
    codigo: string;
    cuenta: string;
    banco: string;
    oficina: string;
    responsable: string;
    fechaDocumento: Date;
    documento: string;
    usuario?: Usuario;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}