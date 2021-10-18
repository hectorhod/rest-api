import { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

export class LoginRoutes extends CommonRoutes{
    configureRoutes(): Router {

        // Comando herdado configura o metodo POST
        this.post("/");

        // Define a raiz desse ROUTE no caso sendo /login
        this.app.use('/login', this.router);
        return this.router;
    }

    constructor(app:Express,name:string){
        super(app,Router(),name);
    }

}