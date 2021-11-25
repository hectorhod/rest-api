// Realiza a importação dos modulos necessários
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { CompareIt, User } from "../Models/Pessoas/User";
import { routeConfig } from "../Routes/decorators/routes.decorator";
import { METHOD } from "../Routes/utils/method.enum";
import { controller } from "./Decorator/controller.decorator";
import { Api } from "./RestController";
import { LoginRoutes } from "./Routes/LoginRoutes";
import { UserRestController } from "./UserRestController";

// Define a classe LoginRestController, a qual controla os requests recebidos no /User
@controller("/login")
export class LoginRestController extends LoginRoutes {
  // É um construtor, inicializando a classe pai AlunoRoutes
  constructor(server: Api) {
    super(server, "loginRoutes");
  }

  @routeConfig(METHOD.GET, "/")
  protected get(req: Request, res: Response) {
    if (req.session.userid) {
      res.send(
        `Olá ${req.session.userid} <a href=\'/logout'>click to logout</a>`
      );
    } else {
      res.sendFile("/login.html", { root: process.cwd() + "/views/login" });
    }
  }

  @routeConfig(METHOD.GET, "/logout", undefined ,true)
  protected async getLogout(req: Request, res: Response) {
    req.session.destroy(() => {
      res.json({ auth: false, token: null})//.redirect("/login");
    });
  }

  // Define um método para o request POST no /User
  @routeConfig(METHOD.POST, "/")
  public async post(req: Request, res: Response) {
    try {
      if (req.body) {
        const route: UserRestController = this.server.routes.getRoute(
          "userRest"
        ) as UserRestController;
        const login: string = req.body.login as string;
        const password: string = req.body.password as string;
        var user: User | undefined = undefined;
        if (route && login && password) {
          if (validateEmail(login)) {
            user = (await route.getUserByEmail(login)) as User;
          } else {
            user = (await route.getUserByUsername(login)) as User;
          }
          if (user && (await CompareIt(password, user))) {
            req.session.userid = user.username;
            console.log(req.session.userid)
            const username = user.username;
            console.log(`usuário ${user.username} logou como tipo ${user.tipoPessoa}`);
            const token = sign({ username }, 'UmaSenhaMuiToSegura1234', {
              expiresIn: 60*5 //5min
            })
            res.send(
              {tipoPessoa: user.tipoPessoa, token: token}
            );

            // res.json({auth: true, token: token})

            // res.status(200).send(`usuário ${user.username} logou como tipo ${user.tipoPessoa}`);
          } else {
            console.log(`usuário ${login} não logou`);
            res.status(400).send("Usuário ou Senha incorreta");
          }
        } else {
          res.status(400).send("algo deu errado");
        }
      } else {
        res.status(400).send(`${req.body} | ${req.params} |`);
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

      // Devolve uma mensagem para o remetente com o erro e um código de status
      res.status(500).send(error.message);
    }
  }
}

export function validateEmail(email: string): boolean {
  const er: RegExp = /^\w*(\.\w*)?@\w*\.[a-z]+(\.[a-z]+)?$/;
  return er.test(email);
}

export function verifyJWT(req: Request): {decoded: any , result: boolean}{
  const token: string = req.headers['x-acess-token'] as string;
  console.log(req.headers)
  if( !token ){
    return {decoded: null, result: false};
  }else{
    verify(token, 'UmaSenhaMuiToSegura1234', function (err, decoded: any){
      if (err){
        return {decoded: null, result: false};
      }

      console.log(decoded);
      return {decoded: decoded, result: true};
    })
  }
  return {decoded: undefined, result: false}
}
