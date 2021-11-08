// Realiza a importação dos modulos necessários
import { Api } from "./Controllers/RestController";
import "reflect-metadata";

// Inicializa a API (para inicializar utilize "npm run start" ou "npm run nodemon")
new Api("apprender");
