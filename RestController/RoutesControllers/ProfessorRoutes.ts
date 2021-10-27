import { Router,Express } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

export class ProfessorRoutes extends CommonRoutes{
    
    public configureRoutes():Router{
         // Comando herdado configura o metodo GET
         this.get("/");

         // Comando herdado configura o metodo POST
         this.post("/");
         this.postUser("/postUser")
 
         // Comando herdado configura o metodo PUT
         this.put("/update")
 
         // Comando herdado configura o metodo DELETE
         this.delete("/delete")
 
         // Define a raiz desse ROUTE no caso sendo /professor
         this.app.use('/professor', this.router);
         return this.router;
    }

    constructor(app:Express,routeName:string){
        super(app,Router(),routeName);
    }

    protected postUser(uri:string){ throw new Error("Método não foi declarado!!"); };

}