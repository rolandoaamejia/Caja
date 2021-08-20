import { AfterInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Rol as RoleEty } from "./role.entity";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        unique: true,
        nullable: false,
        length: 100,
    })
    usuario: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    password: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    nombres: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    apellidos: string;

    @OneToOne(type => RoleEty)
    @JoinColumn()
    rol: RoleEty;

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