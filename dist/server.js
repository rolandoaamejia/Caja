"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const initialSetup_lib_1 = require("./libs/initialSetup.lib");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv.config();
const app = express_1.default();
//* Settings
app.set('port', process.env.PORT || 3000);
//* Middlewares
app.use(helmet_1.default());
const corsOptions = {
    origin: `${process.env.HOST_FRONTEND}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};
app.use(cors_1.default(corsOptions));
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//* Routes
app.use('/api', auth_routes_1.default);
app.use((req, res, next) => {
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