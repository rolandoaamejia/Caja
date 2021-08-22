"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
function main() {
    const port = server_1.default.get('port');
    server_1.default.listen(port);
    console.log(`Escuchando en el puerto ${port}`);
}
main();
//# sourceMappingURL=index.js.map