import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../MongoDB/MongoController";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

export class DiretorRoutes extends CommonRoutes {
  constructor(server: Api, routeName: string) {
    super(server, Router(), routeName);
  }

  protected postUser(req: Request, res: Response) {
    throw new Error("Método não foi declarado!!");
  }

  public async deletePessoa(id: ObjectId) {
    try {
      if (id) {

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: id };

        // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
        const result = await getCollection("Diretors")?.collection?.deleteOne(
          query
        );

        // Exibe o resultado da operação anterior
        result
          ? (console.log("Diretor removido com sucesso com o id " + id))
          : (console.log("Diretor não foi removido."));
      } else {
        throw new Error("A requisição não pode ser concluida pela falta do ID");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

    }
  }
}
