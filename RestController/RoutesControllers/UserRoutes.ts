import { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

export abstract class UserRoutes extends CommonRoutes{
    configureRoutes(): Router {
        // Comando herdado configura o metodo GET
        this.get("/");
        // Comando herdado configura o metodo GET
        this.getById("/id");
        // Comando herdado configura o metodo GET
        this.getByUsername("/username");

        // Comando herdado configura o metodo POST
        this.post("/");

        // Comando herdado configura o metodo PUT
        this.put("/update")

        // Comando herdado configura o metodo DELETE
        this.delete("/delete")

        // Define a raiz desse ROUTE no caso sendo /professor
        this.app.use('/users', this.router);
        return this.router;
    }

    constructor(app:Express,name:string){
        super(app,Router(),name);
    }

    public abstract getById(uri:string): void;
    public abstract getByUsername(uri:string): void;
    
}