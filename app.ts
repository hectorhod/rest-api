// Realiza a importação dos modulos necessários
import "reflect-metadata";
import { Api, controllers } from "./Controllers/RestController";

const PORT = 3000;

Api.collectionsStart();

// Inicializa a API (para inicializar utilize "npm run start" ou "npm run nodemon")
new Api("apprender", PORT, controllers);
// new Api("apprender1", PORT+1, controllers.slice(2, 4));
// new Api("apprender2", PORT+2, controllers.slice(4, 6));
