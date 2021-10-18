// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { Express } from "express";
import { LoginRoutes } from "./RoutesControllers/LoginRoutes";

// Define a classe LoginRestController, a qual controla os requests recebidos no /aluno
export class LoginRestController extends LoginRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(app: Express){
        super(app,"loginRoutes");
    }

    

}