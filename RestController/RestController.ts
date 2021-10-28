// Realiza a importação dos modulos necessários
import MongoStore from "connect-mongo";
import express from "express";
import { Request } from "express-serve-static-core";
import session from "express-session";
import { MongoClient } from "mongodb";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { AlunoRestController } from "./AlunoRestController";
import { DiretorRestController } from "./DiretorRestController";
import { LibraryRestController } from "./LibraryRestController";
import { LoginRestController } from "./LoginRestController";
import { ProfessorRestController } from "./ProfessorRestController";
import { UserRestController } from "./UserRestController";

// Define a porta de hospedagem
const PORT = 3000;

// Define o tipo de servidor
const app = express();

declare module 'express-session' {
  export interface SessionData {
    userid: string;
  }
}

// Armazena as ROUTE em uma lista de routes
export const routes:Array<CommonRoutes> = new Array<CommonRoutes>();

// Serve para inicializar a API
export function ApiStart(mongoClient: Promise<MongoClient>, dbName: string){
    // Define que a api vai receber JSON/Application
    app.use(session({
        secret:"tenstandoEssabagaçadeSesSion",
        resave:false,
        saveUninitialized: true,
        store: MongoStore.create({ 
            clientPromise: mongoClient,
            dbName: dbName,
            crypto: {
                secret: 'conexaoComOMongo'
              }
        }),
        cookie: {
            maxAge: 1000*60*60*24,
            sameSite: true,
            httpOnly: true,
            secure: false
        }
    }))
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))    
    app.use('/login/static', express.static(process.cwd()+"/views/login"));

    // Define qual porta o sistema estará observando
    app.listen(PORT, () => {
        console.log("Servidor rodando na porta " + PORT);
    });
    
    // Empurra uma ROUTE para a lista de routes
    routes.push(new AlunoRestController(app));
    routes.push(new ProfessorRestController(app));
    routes.push(new DiretorRestController(app));
    routes.push(new LibraryRestController(app));
    routes.push(new UserRestController(app));
    routes.push(new LoginRestController(app));




}

export function getRoute(routeName:string){
    // Procura na lista de routes a ROUTE com nome especificado
    try{
        var route = routes.find((route) => {
            return route.getName() === routeName
        });
        
        if(route){
            return route ;
        }else {
            throw new Error("Não existia a route "+routeName);
        }

    }catch(error: any){
        // Imprime no console o erro
        console.log(error);
    }
}

// Define um endereço de escuta para responder (neste caso localhost:port/)
app.get("/", (req: any, res: any, next: any) => {
    console.log(req.session)

    console.log("Acesso ao base");
    res.status(200).json("Acesso ao base")
})

export{app};