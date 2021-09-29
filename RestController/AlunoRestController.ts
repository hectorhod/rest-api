import { ObjectId } from "bson";
import { collections, MangoController } from "../MangoDB/MangoController";
import { Aluno } from "../Models/Pessoas/Aluno";
import { AlunoRoutes } from "./RoutesControllers/AlunoRoutes";
import { Express } from "express";

export class AlunoRestController extends AlunoRoutes {

    constructor(app: Express){
        super(app);
    }
    
    public get(uri:string) {
        this.router.get(uri, async (_req, res) => {
            try{
                if (collections.collection){
                    const alunos = (await collections.collection.find({}).toArray() as Aluno[]);
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
                const result = await collections.collection?.insertOne(aluno);

                result
                    ? res.status(200).send("Aluno criado com sucesso com o id " + result.insertedId)
                    : res.status(500).send("Aluno não foi criado.");
            } catch(error: any) {
                console.log(error)
                res.status(400).send(error.message);
            }
        })
    }

    public put(uri:string){
        this.router.put(uri+'/:id', async (req,res) => {
            try{
                if (req.params.id){
                    const id = req.params.id;
                    const aluno = req.body as Aluno;
                    const query = {_id: new ObjectId(id)};
                    const result = await collections.collection?.updateOne(query, {$set:aluno});

                    result
                        ? res.status(200).send("Aluno atualizado com sucesso com o id " + id)
                        : res.status(500).send("Aluno não foi atualizado.");
                }else {
                    throw new Error("A requisição não pode ser concluida pela falta do ID")
                }
                
            } catch(error: any){
                console.log(error)
                res.status(400).send(error.message)
            }
        })
    }

    public delete(uri:string){
        this.router.delete(uri+'/:id', async (req,res) => {
            try{
                if (req.params.id){
                    const id = req.params.id;
                    const query = {_id: new ObjectId(id)};
                    const result = await collections.collection?.deleteOne(query);

                    result
                        ? res.status(200).send("Aluno removido com sucesso com o id " + id)
                        : res.status(500).send("Aluno não foi removido.");
                }else {
                    throw new Error("A requisição não pode ser concluida pela falta do ID")
                }
                
            } catch(error: any){
                console.log(error)
                res.status(400).send(error.message)
            }
        })
    }

}