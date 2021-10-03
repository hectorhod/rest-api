// Realiza a importação dos modulos necessários
import {Router, Express} from "express";

// Define a classe abstrata CommonRoutes, a qual define a base dos caminhos ROUTE
export abstract class CommonRoutes {
    // É o sistema responsável pela ROUTE
    app: Express

    // É o ROUTE do sistema
    router: Router;

    // É o nome do ROUTE
    name: string;

    // É um construtor, definindo a classe construida
    constructor(app: Express,router: Router,name: string){
        this.app = app
        this.router = router;
        this.name = name

        // Executa o método sempre que a classe for construída
        this.configureRoutes();
    }

    // Método abstrato para configurar o ROUTE
    abstract configureRoutes(): Router;

    // Métodos que podem só ser utilizados pelas classes filhas para definir o GET,POST,PUT,DELETE
    protected get(uri:string){throw new Error("O Método não foi implementado!!")};
    protected post(uri:string){throw new Error("O Método não foi implementado!!")};
    protected put(uri:string){throw new Error("O Método não foi implementado!!")};
    protected delete(uri:string){throw new Error("O Método não foi implementado!!")};
    
    // Getters e Setters
    public getName() : string {
        return this.name
    }

    public getRouter(): Router{
        return this.router;
    }
    
}