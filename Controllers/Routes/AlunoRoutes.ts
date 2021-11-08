// Realiza a importação dos modulos necessários
import { Request, Response, Router } from "express";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

// Define a classe AlunoRoutes, que controla os caminhos do endereço /aluno
export class AlunoRoutes extends CommonRoutes {
  // É um construtor, inicializando a classe pai CommonRoutes
  constructor(server: Api, routeName: string) {
    super(server, Router(), routeName);
  }

  protected postUser(req: Request, res: Response) {
    throw new Error("Método não foi declarado!!");
  }
}
