import { AfterInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario as UserEty } from "./user.entity";

@Entity()
export class DocumentoArqueo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        nullable: true,
        length: 100,
    })
    codigo: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    cuenta: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    banco: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    oficina: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    responsable: string;

    @Column('varchar', {
        nullable: false,
    })
    fechaDocumento: Date;

    @Column('varchar', {
        nullable: false
    })
    documento: string;

    @ManyToOne(type => UserEty)
    @JoinColumn()
    usuario: UserEty;

    @CreateDateColumn({ nullable: true })
    fechaCreacion: Date

    @UpdateDateColumn({ nullable: true })
    fechaActualizacion: Date

    @AfterInsert()
    createDates() {
        this.fechaCreacion = new Date;
    }

    @BeforeUpdate()
    updateDates() {
        this.fechaActualizacion = new Date;
    }
}
