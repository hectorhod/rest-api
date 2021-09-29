import { Express, Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";

export class AlunoRoutes extends CommonRoutes{
    configureRoutes(): Router {
         this.router.get("/", (req: any, res: any, next: any) => {
            console.log("Acesso ao aluno");
            res.status(200).json("Acesso ao aluno");
        });

        this.app.use('/aluno', this.router);
        return this.router;
    }
    
    constructor(app: Express){
        super(app,Router(),'AlunoRoutes');

        this.configureRoutes();
    }


}

