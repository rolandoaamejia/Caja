import { AfterInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        unique: true,
        nullable: false,
        length: 100,
    })
    nombre: string;

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