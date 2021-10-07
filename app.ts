// Realiza a importação dos modulos necessários
import { MongoController } from "./MongoDB/MongoController";
import { ApiStart } from "./RestController/RestController";

// Cria um controlado para o MongoDB
const mongo:MongoController = new MongoController();

// Realiza a conexão com as COLLECTIONS do controlado mongo
mongo.ConnectCollection("Alunos");
mongo.ConnectCollection("Professors");
mongo.ConnectCollection("Diretors");
mongo.ConnectCollection("Livros");
mongo.ConnectCollection("users");

// Exibe os objetos de COLLECTIONS conectados
// console.log(collections)

// Inicializa a API (para inicializar utilize "npm run start" ou "npm run nodemon")
ApiStart(); 

