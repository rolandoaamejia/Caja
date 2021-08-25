"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
let Usuario = class Usuario {
    createDates() {
        this.fechaCreacion = new Date;
    }
    updateDates() {
        this.fechaActualizacion = new Date;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        unique: true,
        nullable: false,
        length: 100,
    }),
    __metadata("design:type", String)
], Usuario.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 100,
    }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 100,
    }),
    __metadata("design:type", String)
], Usuario.prototype, "nombres", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 100,
    }),
    __metadata("design:type", String)
], Usuario.prototype, "apellidos", void 0);
__decorate([
    typeorm_1.ManyToOne(type => role_entity_1.Rol),
    typeorm_1.JoinColumn(),
    __metadata("design:type", role_entity_1.Rol)
], Usuario.prototype, "rol", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaCreacion", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaActualizacion", void 0);
__decorate([
    typeorm_1.AfterInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Usuario.prototype, "createDates", null);
__decorate([
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Usuario.prototype, "updateDates", null);
Usuario = __decorate([
    typeorm_1.Entity()
], Usuario);
exports.Usuario = Usuario;
//# sourceMappingURL=user.entity.js.map