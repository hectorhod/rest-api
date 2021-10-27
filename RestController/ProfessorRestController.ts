// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { Express } from "express";
import { ProfessorRoutes } from "./RoutesControllers/ProfessorRoutes";
import { Professor } from "../Models/Pessoas/Professor";
import { User } from "../Models/Pessoas/User";
import { UserRestController } from "./UserRestController";
import { getRoute } from "./RestController";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";

// Define a classe ProfessorRestController, a qual controla os requests recebidos no /professor
export class ProfessorRestController extends ProfessorRoutes {

    // É um construtor, inicializando a classe pai ProfessorRoutes
    constructor(app: Express){
        super(app,"professorRest");
    }
    
    // Define um método para o request GET no /professor
    public get(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri, async (_req, res) => {
            try{
                // Obtem a COLLECTION necessária da lista de collection
                const collection = getCollection("Professors");
                if (collection){
                    // Obtém todos os professors do MongoDB
                    const professors = (await collection?.collection?.find({}).toArray() as Professor[]);

                    // Devolve uma mensagem para o remetente com os professors e um código de status
                    res.status(200).send(professors)
                    console.log("Professors retornado com sucesso")
                }else {
                    // Joga um novo erro caso não exista uma collection
                    throw new Error("Collections Professor estava nulo!")
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
                // Cria um objeto Professor utilizando o json recebido no corpo do request
                const professor = req.body as Professor;
                console.log(req.body)

                // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
                const result = await getCollection("Professors")?.collection?.insertOne(professor);
                console.log(result)


                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("Professor criado com sucesso com o id " + result.insertedId),
                        console.log("Professor criado com sucesso com o id " + result.insertedId))
                    : (res.status(500).send("Professor não foi criado com sucesso"),
                        console.log("Professor não foi criado com sucesso"))
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
                    var result: User = await route.createUser(req.body.username, req.body.password, req.body.email, req.body.pessoa, TipoPessoa.Professor, false);

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

                    // Cria um objeto Professor utilizando o json recebido no corpo do request
                    const professor = req.body as Professor;

                    // Cria uma query de pesquisa com o id recebido
                    const query = {_id: new ObjectId(id)};

                    // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
                    const result = await getCollection("Professors")?.collection?.updateOne(query, {$set:professor});

                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Professor atualizado com sucesso com o id " + id),
                            console.log("Professor atualizado com sucesso com o id " + id))
                        : (res.status(500).send("Professor não foi atualizado."),
                            console.log("Professor não foi atualizado."))
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
                    const result = await getCollection("Professors")?.collection?.deleteOne(query);
                    
                    // Exibe o resultado da operação anterior
                    result
                        ? (res.status(200).send("Professor removido com sucesso com o id " + id),
                            console.log("Professor removido com sucesso com o id " + id))
                        : (res.status(500).send("Professor não foi removido."),
                            console.log("Professor não foi removido."))
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