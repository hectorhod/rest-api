import { MangoController } from "./MangoDB/MangoController";
import { ApiStart } from "./RestController/RestController";
const mongo:MangoController = new MangoController();

mongo.ConnectCollection("Alunos");
mongo.ConnectCollection("Users");

ApiStart();

