// Realiza a importação dos modulos necessários
import MongoStore from "connect-mongo";
import express, {Express} from "express";
import session from "express-session";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv"
import { MongoController } from "../MongoDB/MongoController";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { Routes } from "../Routes/Routes";
import { LibraryRestController } from "./LibraryRestController";
import { AlunoRestController } from "./AlunoRestController";
import { DiretorRestController } from "./DiretorRestController";
import { ProfessorRestController } from "./ProfessorRestController";
import { LoginRestController } from "./LoginRestController";
import { UserRestController } from "./UserRestController";

dotenv.config({path: './banco.env'});

const oneDay = 1000*60*60*24;

// Define a porta de hospedagem
const PORT = 3000;
export const servers:Api[] = [];


// Define o tipo de servidor
declare module 'express-session' {
  export interface SessionData {
    userid: string;
  }
}

export class Api{
    private _serverName: string;
    private static dbName = process.env.BD_CONN_NAME
    private static mongo:MongoController = new MongoController();
    private static mongoClient = Api.mongo.getConnection();
    private readonly _app: Express;
    private _routes:any;

    constructor(serverName: string) {
        this._serverName = serverName;
        this._app = express()
        Api.collectionsStart();
        this.configureMiddleware();
        
        servers.push(this)
        this._routes = new Routes(this);
        // Define qual porta o sistema estará observando
        this._app.listen(PORT, () => {
            console.log("Servidor rodando na porta " + PORT);
        });    
    }

    private static collectionsStart(){
        Api.mongo.ConnectCollection("Alunos");
        Api.mongo.ConnectCollection("Professors");
        Api.mongo.ConnectCollection("Diretors");
        Api.mongo.ConnectCollection("Livros");
        Api.mongo.ConnectCollection("Users");
    }

    public configureMiddleware() {
        // Required for POST requests
        this._app.use(express.json());
        this._app.use(express.urlencoded({extended: true}))    
        this._app.use('/login/static', express.static(process.cwd()+"/views/login"));

        //session & cookies
        this._app.use(session({
            secret:"tenstandoEssabagaçadeSesSion",
            resave:false,
            saveUninitialized: true,
            store: MongoStore.create({ 
                clientPromise: Api.mongoClient,
                dbName: Api.dbName,
                crypto: {
                    secret: 'conexaoComOMongo'
                  },
                ttl: oneDay
            }),
            cookie: {
                maxAge: oneDay,
                sameSite: true,
                httpOnly: true,
                secure: false
            }
        }))

        // CORS
        this._app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });
    }

    get app(): Express{
        return this._app;
    }
    get routes(): Routes{
        return this._routes;
    }
    get serverName(): string{
        return this._serverName;
    }
}

export function getServer(serverName:string){
    
    let serverReturn = servers.find((api) =>{
        return api.serverName === serverName
    })
    if(serverReturn){
        return serverReturn;
    }else {
        throw new Error("Não existia o server "+serverName);
    }
}

export const controllers = [
    LibraryRestController,
    AlunoRestController,
    DiretorRestController,
    ProfessorRestController,
    LoginRestController,
    UserRestController
]
// export { app };