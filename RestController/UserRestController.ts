// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { getCollection } from "../MongoDB/MongoController";
import { HashIt, User } from "../Models/Pessoas/User";
import { Express } from "express";
import { UserRoutes } from "./RoutesControllers/UserRoutes";
import { TipoPessoa } from "../Models/Pessoas/TipoPessoa/TipoPessoa";

// Define a classe UserRestController, a qual controla os requests recebidos no /user
export class UserRestController extends UserRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(app: Express){
        super(app,"userRest");
    }

// Define um método para o request GET no /professor
    public get(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri, async (_req, res) => {
            try{
                // Obtem a COLLECTION necessária da lista de collection
                var users = await this.getAllUsers();
                res.status(200).send(users);
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(500).send(error.message);
            }
        });
    }

    private async getAllUsers() {
        const collection = getCollection("Users");
        if (collection) {
            // Obtém todos os users do MongoDB
            const users = (await collection?.collection?.find({}).toArray() as User[]);
            return users;

        } else {
            // Joga um novo erro caso não exista uma collection
            throw new Error("Collections Users estava nulo!");
        }
    }

    // Define um método para o request GET no /user
    protected getById(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri+'/:id', async (req, res) => {
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

        });
    }

    protected getByUsername(uri:string) {
        // Configura o router para uma uri
        this.router.get(uri+"/:username", async (req, res) => {
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
        });
    }

    // Define um método para o request POST no /user
    protected post(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
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
        })
    }

    private async getListUsername(): Promise<string[]>{
        var users = await this.getAllUsers();
        var usernames: string[] = [];
        (users).forEach(( user ) => {
            usernames.push(user.username)
        })

        return usernames;
    }

    private async getListEmail(): Promise<string[]>{
        var users = await this.getAllUsers();
        var usernames: string[] = [];
        (users).forEach(( user ) => {
            usernames.push(user.email)
        })

        return usernames;
    }

    // Define um método para o request PUT no /user
    protected put(uri:string){
        // Configura o router para uma uri
        this.router.put(uri+'/:id', async (req,res) => {
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
        })
    }

    // Define um método para o request DELETE no /user
    protected delete(uri:string){
        // Configura o router para uma uri
        this.router.delete(uri+'/:id', async (req,res) => {
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
        })
    }

    public async getUserById(id: string): Promise<User>{
        const query = { _id:new ObjectId(id) };
        const result = await getCollection("Users")?.collection?.findOne(query) as User;
        return result;
    }

    public async createUser(username: string, password: string, email: string, pessoa: ObjectId, tipoPessoa: TipoPessoa | undefined, active: boolean): Promise<User>{
        try{
            var listUsername = await this.getListUsername()
            var listEmail = await this.getListEmail()

            if((listUsername.includes(username))){
                throw new Error("O username já existe no sistema!!");
                
            }else if(listEmail.includes(email)){
                throw new Error("O email já existe no sistema!!");
                
            }
            
            // Cria um objeto User utilizando o json recebido no corpo do request
            const user = new User(username,password,email,pessoa,tipoPessoa,active);
            user.password = await HashIt(user.password)
            console.log(user)

            // Obtem a COLLECTION necessária da lista de collection e tenta inserir o objeto
            const result = await getCollection("Users")?.collection?.insertOne(user);
            console.log(result)
            return user;
        }catch(error: any){
            throw new Error(`Ocorreu um erro ao criar um usuario: ${error}`);
            
        }
    }

}