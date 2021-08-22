"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const initialSetup_lib_1 = require("./libs/initialSetup.lib");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = express_1.default();
//* Settings
app.set('port', 3000);
//* Middlewares
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
//* Routes
app.use('/api', auth_routes_1.default);
app.use((req, res) => {
    try {
        return res.json({ message: "No se encontró la ruta solicitada" });
    }
    catch (error) {
        return res.json(error);
    }
});
//? Inicia la conexión y importa el archivo ormconfig.json
typeorm_1.createConnection().then((res) => {
    //? Verificamos los roles actuales o los creamos
    initialSetup_lib_1.createRoles();
}, (err) => console.error(err));
exports.default = app;
//# sourceMappingURL=server.js.map