import { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

export class DiretorRoutes extends CommonRoutes{
    
    public configureRoutes():Router{
         // Comando herdado configura o metodo GET
         this.get("/");

         // Comando herdado configura o metodo POST
         this.post("/");
 
         // Comando herdado configura o metodo PUT
         this.put("/update")
 
         // Comando herdado configura o metodo DELETE
         this.delete("/delete")
 
         // Define a raiz desse ROUTE no caso sendo /diretor
         this.app.use('/diretor', this.router);
         return this.router;
    }

    constructor(app:Express,routeName:string){
        super(app,Router(),routeName);
    }
}