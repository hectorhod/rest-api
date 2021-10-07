// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { Aluno } from "../Models/Pessoas/Aluno";
import { AlunoRoutes } from "./RoutesControllers/AlunoRoutes";
import { Express } from "express";
import { Console } from "console"; //Marcelo, vai usar esse modulo???

// Define a classe AlunoRestController, a qual controla os requests recebidos no /aluno
export class AlunoRestController extends AlunoRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(app: Express){
        super(app,"alunoRest");
    }
    
    // Define um método para o request GET no /aluno
    public get(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri, async (_req, res) => {
            try{
                // Obtem a COLLECTION necessária da lista de collection
                const collection = getCollection("Alunos");
                if (collection){
                    // Obtém todos os alunos do MongoDB
                    const alunos = (await collection?.collection?.find({}).toArray() as Aluno[]);

                    // Devolve uma mensagem para o remetente com os alunos e um código de status
                    res.status(200).send(alunos)
                    console.log("Alunos retornado com sucesso")
                }else {
                    // Joga um novo erro caso não exista uma collection
                    throw new Error("Collections Users estava nulo!")
                }
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        });
    }

    // Define um método para o request POST no /aluno
    public post(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
            try{
                // Cria um objeto Aluno utilizando o json recebido no corpo do request
                const aluno = req.body as Aluno;
                console.log(req.body)

                // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
                const result = await getCollection("Alunos")?.collection?.insertOne(aluno);
                console.log(result)


                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("Aluno criado com sucesso com o id " + result.insertedId),
                        console.log("Aluno criado com sucesso com o id " + result.insertedId))
                    : (res.status(500).send("Aluno não foi criado com sucesso"),
                        console.log("Aluno não foi criado com sucesso"))
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        })
    }

    // Define um método para o request PUT no /aluno
    public put(uri:string){
        // Configura o router para uma uri
        this.router.put(uri+'/:id', async (req,res) => {
            try{
                if (req.params?.id){
                    //Obtem um id da url
                    const id = req.params.id;

                    // Cria um objeto Aluno utilizando o json recebido no corpo do request
                    const aluno = req.body as Aluno;

                    // Cria uma query de pesquisa com o id recebido
                    const query = {_id: new ObjectId(id)};

                    // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
                    const result = await getCollection("Alunos")?.collection?.updateOne(query, {$set:aluno});

                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Aluno atualizado com sucesso com o id " + id),
                            console.log("Aluno atualizado com sucesso com o id " + id))
                        : (res.status(500).send("Aluno não foi atualizado."),
                            console.log("Aluno não foi atualizado."))
                }else {
                    throw new Error("A requisição não pode ser concluida pela falta do ID")
                }
                
            } catch(error: any){
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        })
    }

    // Define um método para o request DELETE no /aluno
    public delete(uri:string){
        // Configura o router para uma uri
        this.router.delete(uri+'/:id', async (req,res) => {
            try{
                if (req.params.id){
                    //Obtem um id da url
                    const id = req.params.id;

                    // Cria uma query de pesquisa com o id recebido
                    const query = {_id: new ObjectId(id)};

                    // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
                    const result = await getCollection("Alunos")?.collection?.deleteOne(query);
                    
                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Aluno removido com sucesso com o id " + id),
                            console.log("Aluno removido com sucesso com o id " + id))
                        : (res.status(500).send("Aluno não foi removido."),
                            console.log("Aluno não foi removido."))
                }else {
                    throw new Error("A requisição não pode ser concluida pela falta do ID")
                }
                
            } catch(error: any){
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        })
    }

}