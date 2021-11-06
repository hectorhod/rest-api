// Realiza a importação dos modulos necessários
import { Express, Router } from "express";
import { CommonRoutes, METHOD, routeConfig } from "../../Routes/CommonRoutes";
import { getRoute } from "../../Routes/Routes";

// Define a classe LibraryRoutes, que controla os caminhos do endereço /aluno
export class LibraryRoutes extends CommonRoutes{
    // Comando herdado para configurar os endereços observados
    configureRoutes(): Router {
        // Comando herdado configura o metodo GET
        this.get("/");
        this.getById("/getById");

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

    protected getById(uri:string){throw new Error("O método não foi implementado!!!");
    };

    //Pelo santo amor, não mecha com esses negocios ainda (fase de teste)
    @routeConfig(METHOD.GET,'/test', "libraryRest")
    protected getTest(){
        return "Hello World";
    }

}

