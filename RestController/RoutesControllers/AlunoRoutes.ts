import { Express, Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes";
import { collections } from "../../MangoDB/MangoController";
import { Aluno } from "../../Models/Pessoas/Aluno";
import { ObjectId } from "bson";

export class AlunoRoutes extends CommonRoutes{
    configureRoutes(): Router {
        this.get("/");
        this.post("/");

        this.app.use('/aluno', this.router);
        return this.router;
    }
    
    constructor(app: Express){
        super(app,Router(),'AlunoRoutes');

        this.configureRoutes();
    }

    public get(uri:string) {
        this.router.get(uri, async (_req, res) => {
            try{
                if (collections.users){
                    const alunos = (await collections.users.find({}).toArray() as Aluno[]);
                    res.status(200).send(alunos)
                }else {
                    throw new Error("Collections Users estava nulo!")
                }
            } catch(error) {
                res.status(500).send(error)
            }
        });
    }

    public post(uri:string){

        this.router.post(uri, async (req, res) =>{
            try{
                const aluno = req.body as Aluno;
                console.log(req.body, aluno);
                const result = await collections.users?.insertOne(aluno);

                result
                    ? res.status(200).send("Aluno criado com sucesso com o id " + result.insertedId)
                    : res.status(500).send("Aluno não foi criado.");
            } catch(error: any) {
                console.log(error)
                res.status(400).send(error.message);
            }
        })
    }


}

