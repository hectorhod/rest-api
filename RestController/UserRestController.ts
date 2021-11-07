// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { HashIt, User } from "../Models/Pessoas/User";
import { Express, Request, Response } from "express";
import { UserRoutes } from "./RoutesControllers/UserRoutes";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";
import { validateEmail } from "./LoginRestController";
import { Filter } from "mongodb";
import { nextTick } from "process";
import { Api } from "./RestController";
import { controller } from "../Routes/controller.decorator";
import { routeConfig } from "../Routes/routes.decorator";
import { METHOD } from "../Routes/method.enum";

// Define a classe UserRestController, a qual controla os requests recebidos no /user
@controller('/users')
export class UserRestController extends UserRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(server: Api){
        super(server,"userRest");
    }

// Define um método para o request GET no /professor
    @routeConfig(METHOD.GET, "/")
    public async get(req:Request, res:Response) {
        // Configura o router para uma uri
    
        try{
            if(!this.validateUser(await this.getUserByUsername(req.session.userid),TipoPessoa.Diretor)){
                res.status(400).send(`<p><h2>Acesso Negado !!</h2></p>\n<p><h4>O usuário ${req.session.userid} não tem permissão o suficiente para acessar essa página</h4></p>`);
                return;
            }
            // Obtem a COLLECTION necessária da lista de collection
            var users = await this.getAllUsers();
            res.status(200).send(users);
        } catch(error: any) {
            // Imprime um erro no console
            console.log(error);

            // Devolve uma mensagem para o remetente com o erro e um código de status
            res.status(500).send(error.message);
        }
    }

    // Define um método para o request GET no /user
    @routeConfig(METHOD.GET, "/id/:id")
    protected async getById(req:Request, res:Response) {
        try{
            if (req.params?.id){
                //Obtem um id da url
                const id = req.params.id;

                // Cria uma query de pesquisa com o id recebido
                const result: User = await this.getUserById(id);

                // Exibe o resultado da operação anterior
                if(result){
                    res.status(200).send(`User encontrado com sucesso com o id: ${id}\n${result} `)
                    console.log(`User encontrado com sucesso com o id: ${{id}}\n${result} `)
                }else{
                    res.status(500).send("User não foi encontrado.")
                    console.log("User não foi encontrado.")
                }
                
            }else {
                throw new Error("A requisição não pode ser concluida pela falta do ID")
            }

        } catch(error: any) {
            // Imprime um erro no console
            console.log(error);

            // Devolve uma mensagem para o remetente com o erro e um código de status
            res.status(400).send(error.message);
        }
    }

    @routeConfig(METHOD.GET, "/username/:username")
    protected async getByUsername(req:Request, res:Response) {
        try{
            if (req.params?.username){
                //Obtem um username da url
                const username = req.params.username;

                // Cria uma query de pesquisa com o username recebido
                const query = {username: username};

                // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
                const result = await getCollection("Users")?.collection?.find(query).toArray() as User[];

                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send(`User encontrado com sucesso com o username: ${username}\n${result} `),
                        console.log(`User encontrado com sucesso com o username: ${username}\n${result} `))
                    : (res.status(500).send("User não foi encontrado."),
                        console.log("User não foi encontrado."))
            }else {
                throw new Error("A requisição não pode ser concluida pela falta do ID")
            }
        } catch(error: any) {
            // Imprime um erro no console
            console.log(error);

            // Devolve uma mensagem para o remetente com o erro e um código de status
            res.status(400).send(error.message);
        }
    }

    // Define um método para o request POST no /user
    @routeConfig(METHOD.POST, "/")
    protected async post(req:Request, res:Response){
        try{
            if(req.body){       
                
                var result: User = await this.createUser(req.body.username,req.body.password,req.body.email,req.body.pessoa,req.body.tipoPessoa,req.body.active)

                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("User criado com sucesso com o id " + result._id),
                        console.log("User criado com sucesso com o id " + result._id))
                    : (res.status(500).send("User não foi criado com sucesso"),
                        console.log("User não foi criado com sucesso"))
            }else{
                throw new Error("O payload veio vazio!!");
                
            }
        } catch(error: any) {
            // Imprime um erro no console
            console.log(error);

            // Devolve uma mensagem para o remetente com o erro e um código de status
            res.status(400).send(error.message);
        }
    }

    // Define um método para o request PUT no /user
    @routeConfig(METHOD.PUT, "/update/:id")
    protected async put(req:Request, res:Response){
        try{
            if (req.params?.id){
                //Obtem um id da url
                const id = req.params.id;

                // Cria um objeto User utilizando o json recebido no corpo do request
                const user = req.body as User;

                // Cria uma query de pesquisa com o id recebido
                const query = {_id: new ObjectId(id)};

                // Obtem a COLLECTION necessária da lista de collection e tenta atualizar o objeto
                const result = await getCollection("Users")?.collection?.updateOne(query, {$set:user});

                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("User atualizado com sucesso com o id " + id),
                        console.log("User atualizado com sucesso com o id " + id))
                    : (res.status(500).send("User não foi atualizado."),
                        console.log("User não foi atualizado."))
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

    // Define um método para o request DELETE no /user
    @routeConfig(METHOD.DELETE, "/delete/:id")
    protected async delete(req:Request, res:Response){
        try{
            if (req.params.id){
                //Obtem um id da url
                const id = req.params.id;

                // Cria uma query de pesquisa com o id recebido
                const query = {_id: new ObjectId(id)};

                // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
                const result = await getCollection("Users")?.collection?.deleteOne(query);
                
                // Exibe o resultado da operação anterior
                result
                    ? (res.status(200).send("User removido com sucesso com o id " + id),
                        console.log("User removido com sucesso com o id " + id))
                    : (res.status(500).send("User não foi removido."),
                        console.log("User não foi removido."))
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