// Realiza a importação dos modulos necessários
import MongoStore from "connect-mongo";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import { Server } from "http";
import { MongoController } from "../MongoDB/MongoController";
import { Routes } from "../Routes/Routes";
import { AlunoRestController } from "./AlunoRestController";
import { DiretorRestController } from "./DiretorRestController";
import { LibraryRestController } from "./LibraryRestController";
import { LoginRestController } from "./LoginRestController";
import { ProfessorRestController } from "./ProfessorRestController";
import { UserRestController } from "./UserRestController";

dotenv.config({ path: "./banco.env" });

const oneDay = 1000 * 60 * 60 * 24;

// Define a porta de hospedagem
export const servers: Api[] = [];

// Define o tipo de servidor
declare module "express-session" {
  export interface SessionData {
    userid: string;
  }
}

export class Api {
  private _serverName: string;
  private _server: Server;
  private static dbName = process.env.BD_CONN_NAME;
  private static mongo: MongoController = new MongoController();
  private static mongoClient = Api.mongo.getConnection();
  private readonly _app: Express;
  public readonly port: number;
  private _routes: any;

  constructor(serverName: string, port: number, routesList: any[]) {
    this._serverName = serverName;
    this._app = express();
    this.configureMiddleware();
    this.port = port;

    servers.push(this);
    this._routes = new Routes(this, routesList ??[]);
    // Define qual porta o sistema estará observando
    this._server = this._app.listen(this.port, () => {
      console.log("Servidor rodando na porta " + this.port);
    });
  }

  public static collectionsStart() {
    Api.mongo.ConnectCollection("Alunos");
    Api.mongo.ConnectCollection("Professors");
    Api.mongo.ConnectCollection("Diretors");
    Api.mongo.ConnectCollection("Livros");
    Api.mongo.ConnectCollection("Users");
    Api.mongo.ConnectCollection("Turmas");
    Api.mongo.ConnectCollection("Materias");
    Api.mongo.ConnectCollection("Atividades");
  }

  public configureMiddleware() {
    // Required for POST requests
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(
      "/login/static",
      express.static(process.cwd() + "/views/login")
    );

    //session & cookies
    this._app.use(
      session({
        secret: "tenstandoEssabagaçadeSesSion",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
          clientPromise: Api.mongoClient,
          dbName: Api.dbName,
          crypto: {
            secret: "conexaoComOMongo",
          },
          ttl: oneDay,
        }),
        cookie: {
          maxAge: oneDay,
          sameSite: true,
          httpOnly: true,
          secure: false,
        },
      })
    );

    // this.app.use()

    // CORS
    this._app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "false");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, x-acess-token"
      );
      next();
    });
  }

  get app(): Express {
    return this._app;
  }
  get routes(): Routes {
    return this._routes;
  }
  get serverName(): string {
    return this._serverName;
  }

  get server(): Server {
    return this._server;
  }
}

export function getServer(serverName: string) {
  let serverReturn = servers.find((api) => {
    return api.serverName === serverName;
  });
  if (serverReturn) {
    return serverReturn;
  } else {
    throw new Error("Não existia o server " + serverName);
  }
}

export const controllers = [
  LibraryRestController,
  AlunoRestController,
  DiretorRestController,
  ProfessorRestController,
  LoginRestController,
  UserRestController,
];
// export { app };
