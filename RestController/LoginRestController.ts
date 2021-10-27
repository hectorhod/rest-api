// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { Express, json } from "express";
import { CompareIt, User } from "../Models/Pessoas/User";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { getRoute } from "./RestController";
import { LoginRoutes } from "./RoutesControllers/LoginRoutes";
import { UserRestController } from "./UserRestController";

// Define a classe LoginRestController, a qual controla os requests recebidos no /User
export class LoginRestController extends LoginRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(app: Express){
        super(app,"loginRoutes");
    }

    // Define um método para o request POST no /User
    public post(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
            try{
                if(req.body){
                    const route:UserRestController = getRoute("userRest") as UserRestController;
                    const username = req.body.username;
                    const password = req.body.password;
                    if(route && username && password){
                        const user:User = await route.getUserByUsername(username) as User;
                        if(await CompareIt(password,user)){
                            console.log(`usuário ${user.username} logou como tipo ${user.tipoPessoa}`);
                            res.status(200).send(`usuário ${user.username} logou como tipo ${user.tipoPessoa}`);
                        }else{
                            console.log(`usuário ${user.username} não logou`);
                            res.status(400).send("Senha incorreta");
                        }
                    }else{
                        res.status(400).send("algo deu errado");
                    }

                }else{
                    res.status(400).send("algo deu errado");
                }
                
                
            } catch(error: any) {
                // Imprime um erro no console
                console.log(error);

                // Devolve uma mensagem para o remetente com o erro e um código de status
                res.status(500).send(error.message);
            }
        })
    }

    

}