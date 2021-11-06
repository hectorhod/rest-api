import express, { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { Api } from "../RestController";

export class LoginRoutes extends CommonRoutes{
    configureRoutes(): Router {
        this.get("/")
        this.getLogout()
        // Comando herdado configura o metodo POST
        this.post("/");

        // Define a raiz desse ROUTE no caso sendo /login
        let tmpApp = import('../RestController').then(({Api}) => Api.app)
        tmpApp.then((app) =>{
            app.use('/login', this.router);
        })
        
        return this.router;
    }

    constructor(app:Express,name:string){
        super(app,Router(),name);
    }

    protected getLogout(){ throw new Error("O método não foi declarado!!!");}
    

}