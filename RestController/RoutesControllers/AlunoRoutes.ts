import { Express, Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { collections } from "../../MangoDB/MangoController";
import { Aluno } from "../../Models/Pessoas/Aluno";
import { ObjectId } from "bson";

export class AlunoRoutes extends CommonRoutes{
    configureRoutes(): Router {
        this.get("/");
        this.post("/");
        this.put("/update")
        this.delete("/delete")

        this.app.use('/aluno', this.router);
        return this.router;
    }
    
    constructor(app: Express){
        super(app,Router(),'AlunoRoutes');
    }


}

