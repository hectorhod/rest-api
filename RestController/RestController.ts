// Realiza a importação dos modulos necessários
import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import { MongoClient } from "mongodb";
import { routesStart } from "../Routes/Routes";
import * as dotenv from "dotenv"
import { MongoController } from "../MongoDB/MongoController";
import { CommonRoutes } from "../Routes/CommonRoutes";
import { AlunoRestController } from "./AlunoRestController";
import { DiretorRestController } from "./DiretorRestController";
import { LibraryRestController } from "./LibraryRestController";
import { LoginRestController } from "./LoginRestController";
import { ProfessorRestController } from "./ProfessorRestController";
import { UserRestController } from "./UserRestController";

dotenv.config({path: './banco.env'});

const oneDay = 1000*60*60*24;

// Define a porta de hospedagem
const PORT = 3000;

// Define o tipo de servidor
declare module 'express-session' {
  export interface SessionData {
    userid: string;
  }
}

export class Api{
    private static dbName = process.env.BD_CONN_NAME
    private static mongo:MongoController = new MongoController();
    private static mongoClient = Api.mongo.getConnection();
    public static app = express();
    public static routes:Array<CommonRoutes> = [];

    constructor() {
        Api.collectionsStart();
        this.configureMiddleware();
        Api.app.use(session({
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
        

        Api.routes = [
            new AlunoRestController(Api.app),
            new ProfessorRestController(Api.app),
            new DiretorRestController(Api.app),
            new LibraryRestController(Api.app),
            new UserRestController(Api.app),
            new LoginRestController(Api.app)
        ];
        // routesStart(Api.app);
        // Define qual porta o sistema estará observando
        Api.app.listen(PORT, () => {
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
        Api.app.use(express.json());
        Api.app.use(express.urlencoded({extended: true}))    
        Api.app.use('/login/static', express.static(process.cwd()+"/views/login"));

        // CORS
        Api.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });
    }
}

function ApiConfig(mongoClient: Promise<MongoClient>, dbName: string | undefined): MethodDecorator{
    // Define que a api vai receber JSON/Application
    let tmpApp = import('./RestController').then(({Api}) => Api);
    tmpApp.then((Api) =>{
        

    })
    
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ){}
}

// Define um endereço de escuta para responder (neste caso localhost:port/)
Api.app.get("/", (req: any, res: any, next: any) => {
     

    console.log("Acesso ao base", req.session);
    res.status(200).json("Acesso ao base")
})

// export { app };