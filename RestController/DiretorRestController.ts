// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { Express } from "express";
import { Diretor } from "../Models/Pessoas/Diretor";
import { DiretorRoutes } from "./RoutesControllers/DiretorRoutes";
import { getRoute } from "../Routes/Routes";
import { UserRestController } from "./UserRestController";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";
import { User } from "../Models/Pessoas/User";

// Define a classe ProfessorRestController, a qual controla os requests recebidos no /diretor
export class DiretorRestController extends DiretorRoutes {

    // É um construtor, inicializando a classe pai ProfessorRoutes
    constructor(app: Express){
        super(app,"diretorRest");
    }
    
    // Define um método para o request GET no /professor
    public get(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri, async (_req, res) => {
            try{
                // Obtem a COLLECTION necessária da lista de collection
                const collection = getCollection("Diretors");
                if (collection){
                    // Obtém todos os diretors do MongoDB
                    const diretors = (await collection?.collection?.find({}).toArray() as Diretor[]);

                    // Devolve uma mensagem para o remetente com os diretors e um código de status
                    res.status(200).send(diretors)
                    console.log("Diretors retornado com sucesso")
                }else {
                    // Joga um novo erro caso não exista uma collection
                    throw new Error("Collections Diretor estava nulo!")
                }
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        });
    }

    // Define um método para o request POST no /professor
    public post(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
            try{
                // Cria um objeto Diretor utilizando o json recebido no corpo do request
                const professor = req.body as Diretor;
                console.log(req.body)

                // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
                const result = await getCollection("Diretors")?.collection?.insertOne(professor);
                console.log(result)


                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("Diretor criado com sucesso com o id: " + result.insertedId),
                        console.log("Diretor criado com sucesso com o id: " + result.insertedId))
                    : (res.status(500).send("Diretor não foi criado com sucesso"),
                        console.log("Diretor não foi criado com sucesso"))
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        })
    }

    // Define um método para o request POST no /user
    protected postUser(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
            try{
                var route = getRoute("userRest") as UserRestController;
                if(req.body && route){       
                    var result: User = await route.createUser(req.body.username, req.body.password, req.body.email, req.body.pessoa, TipoPessoa.Diretor, false);

                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("User criado com sucesso com o id " + result._id),
                            console.log("User criado com sucesso com o id " + result._id))
                        : (res.status(500).send("User não foi criado com sucesso"),
                            console.log("User não foi criado com sucesso"))
                }else{
                    throw new Error("O payload ou route veio vazio!!");
                    
                }
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(400).send(error.message);
            }
        })
    }


    // Define um método para o request PUT no /professor
    public put(uri:string){
        // Configura o router para uma uri
        this.router.put(uri+'/:id', async (req,res) => {
            try{
                if (req.params?.id){
                    //Obtem um id da url
                    const id = req.params.id;

                    // Cria um objeto Diretor utilizando o json recebido no corpo do request
                    const professor = req.body as Diretor;

                    // Cria uma query de pesquisa com o id recebido
                    const query = {_id: new ObjectId(id)};

                    // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
                    const result = await getCollection("Diretors")?.collection?.updateOne(query, {$set:professor});

                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Diretor atualizado com sucesso com o id: " + id),
                            console.log("Diretor atualizado com sucesso com o id: " + id))
                        : (res.status(500).send("Diretor não foi atualizado."),
                            console.log("Diretor não foi atualizado."))
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

    // Define um método para o request DELETE no /professor
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
                    const result = await getCollection("Diretors")?.collection?.deleteOne(query);
                    
                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Diretor removido com sucesso com o id " + id),
                            console.log("Diretor removido com sucesso com o id " + id))
                        : (res.status(500).send("Diretor não foi removido."),
                            console.log("Diretor não foi removido."))
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