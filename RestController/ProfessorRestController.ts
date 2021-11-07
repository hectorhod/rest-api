// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { Express, Request, Response } from "express";
import { ProfessorRoutes } from "./RoutesControllers/ProfessorRoutes";
import { Professor } from "../Models/Pessoas/Professor";
import { User } from "../Models/Pessoas/User";
import { UserRestController } from "./UserRestController";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";
import { Api } from "./RestController";
import { controller } from "../Routes/controller.decorator";
import { METHOD } from "../Routes/method.enum";
import { routeConfig } from "../Routes/routes.decorator";

// Define a classe ProfessorRestController, a qual controla os requests recebidos no /professor
@controller('/professor')
export class ProfessorRestController extends ProfessorRoutes {

    // É um construtor, inicializando a classe pai ProfessorRoutes
    constructor(server: Api){
        super(server,"professorRest");
    }
    
    // Define um método para o request GET no /professor
    @routeConfig(METHOD.GET, '/')
    protected async get(req:Request, res:Response) {
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
        
    }

    // Define um método para o request POST no /professor
    @routeConfig(METHOD.POST, '/')
    protected async post(req:Request, res:Response){
        try{
            // Cria um objeto Professor utilizando o json recebido no corpo do request
            const professor = req.body as Professor;

            // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
            const result = await getCollection("Professors")?.collection?.insertOne(professor);


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
        
    }
    
    // Define um método para o request POST no /user
    @routeConfig(METHOD.POST, '/user')
    protected async postUser(req:Request, res:Response){
        try{
            var route = this.server.routes.getRoute("userRest") as UserRestController;
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
        
    }

    // Define um método para o request PUT no /professor
    @routeConfig(METHOD.PUT, '/update/:id')
    protected async put(req:Request, res:Response){
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
        
    }

    // Define um método para o request DELETE no /professor
    @routeConfig(METHOD.PUT, '/delete/:id')
    protected async delete(req:Request, res:Response){
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
        
    }

}