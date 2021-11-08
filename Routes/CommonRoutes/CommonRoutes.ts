// Realiza a importação dos modulos necessários
import { Request, Response, Router } from "express";
import { Api } from "../../Controllers/RestController";

// Define a classe abstrata CommonRoutes, a qual define a base dos caminhos ROUTE
export abstract class CommonRoutes {
  // É o sistema responsável pela ROUTE
  server: Api;

  // É o ROUTE do sistema
  router: Router;

  // É o nome do ROUTE
  name: string;

  // É um construtor, definindo a classe construida
  constructor(server: Api, router: Router, name: string) {
    this.server = server;
    this.router = router;
    this.name = name;
  }

  // Métodos que podem só ser utilizados pelas classes filhas para definir o GET,POST,PUT,DELETE
  protected get(req: Request, res: Response) {
    throw new Error("O Método não foi implementado!!");
  }
  protected post(req: Request, res: Response) {
    throw new Error("O Método não foi implementado!!");
  }
  protected put(req: Request, res: Response) {
    throw new Error("O Método não foi implementado!!");
  }
  protected delete(req: Request, res: Response) {
    throw new Error("O Método não foi implementado!!");
  }

  // Getters e Setters
  public getName(): string {
    return this.name;
  }

  public getRouter(): Router {
    return this.router;
  }
}
