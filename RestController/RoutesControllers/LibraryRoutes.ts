// Realiza a importação dos modulos necessários
import { Express, Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

// Define a classe LibraryRoutes, que controla os caminhos do endereço /aluno
export class LibraryRoutes extends CommonRoutes{
    // Comando herdado para configurar os endereços observados
    configureRoutes(): Router {
        // Comando herdado configura o metodo GET
        this.get("/");

        // Comando herdado configura o metodo POST
        this.post("/");

        // Comando herdado configura o metodo PUT
        this.put("/update")

        // Comando herdado configura o metodo DELETE
        this.delete("/delete")

        // Define a raiz desse ROUTE no caso sendo /aluno
        this.app.use('/biblioteca', this.router);
        return this.router;
    }
    
    // É um construtor, inicializando a classe pai CommonRoutes
    constructor(app: Express, routeName:string){
        super(app,Router(),routeName);
    }


}

