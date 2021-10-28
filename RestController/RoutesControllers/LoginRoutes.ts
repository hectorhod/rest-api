import express, { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { app } from "../RestController";

export class LoginRoutes extends CommonRoutes{
    configureRoutes(): Router {
        this.get("/")
        this.getLogout()
        // Comando herdado configura o metodo POST
        this.post("/");

        // Define a raiz desse ROUTE no caso sendo /login
        app.use('/login', this.router);
        return this.router;
    }

    constructor(app:Express,name:string){
        super(app,Router(),name);
    }

    protected getLogout(){ throw new Error("não declarado");}
    

}