// Realiza a importação dos modulos necessários
import { Express } from "express";
import { CompareIt, User } from "../Models/Pessoas/User";
import { METHOD } from "../Routes/CommonRoutes";
import { getRoute } from "../Routes/Routes";
import { Api } from "./RestController";
import { LoginRoutes } from "./RoutesControllers/LoginRoutes";
import { UserRestController } from "./UserRestController";

// Define a classe LoginRestController, a qual controla os requests recebidos no /User
export class LoginRestController extends LoginRoutes {

    // É um construtor, inicializando a classe pai AlunoRoutes
    constructor(app: Express){
        super(app,"loginRoutes");
    }

    protected get(uri:string){
        this.router.get(uri,(req,res) =>{
            if(req.session.userid){
                res.send(`Olá ${req.session.userid} <a href=\'/logout'>click to logout</a>`)
            }else{
                res.sendFile('/login.html', {root: process.cwd()+"/views/login"})
            }
        })
    }

    protected async getLogout(){
        let tmpApp = await import('./RestController').then(({Api}) => Api.app)
        tmpApp.get("/logout", (req: any, res: any) => {
            req.session.destroy(() =>{
                res.redirect('/login');
            });
        })
    }

    // Define um método para o request POST no /User
    public post(uri:string){
        // Configura o router para uma uri
        this.router.post(uri, async (req, res) =>{
            try{
                if(req.body){
                    const route:UserRestController = getRoute("userRest") as UserRestController;
                    const login: string = req.body.login;
                    const password: string = req.body.password;
                    var user:User | undefined = undefined;
                    if(route && login && password){

                        if(validateEmail(login)){
                            user = await route.getUserByEmail(login) as User;
                        }else{
                            user = await route.getUserByUsername(login) as User;
                        }
                        if(user && await CompareIt(password,user)){
                            req.session.userid = user.username;
                            console.log(`usuário ${login} logou como tipo ${user.tipoPessoa}`);
                            res.send(`Olá ${req.session.userid} <a href=\'/logout'>click to logout</a>`)

                            // res.status(200).send(`usuário ${user.username} logou como tipo ${user.tipoPessoa}`);
                        }else{
                            console.log(`usuário ${login} não logou`);
                            res.status(400).send("Usuário ou Senha incorreta");
                        }
                    }else{
                        res.status(400).send("algo deu errado");
                    }

                }else{
                    console.log(req.body.login)
                    res.status(400).send(`${req.body} | ${req.params} |`);
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

export function validateEmail(email:string): boolean{
    const er: RegExp = /^\w*(\.\w*)?@\w*\.[a-z]+(\.[a-z]+)?$/
    return er.test(email)
}