// Realiza a importação dos modulos necessários
import { Router } from "express";
import { ObjectId } from "mongodb";
import { Livro } from "../../Models/Livro/Livro";
import { getCollection } from "../../MongoDB/MongoController";
import { getArchive } from "../../pdfhandler/pdfhandler";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

// Define a classe LibraryRoutes, que controla os caminhos do endereço /aluno
export class LibraryRoutes extends CommonRoutes {
  // É um construtor, inicializando a classe pai CommonRoutes
  constructor(server: Api, routeName: string) {
    super(server, Router(), routeName);
  }

  // protected getById(req:Request, res:Response){throw new Error("O método não foi implementado!!!");
  // };

  public static async getLivroById(id: string): Promise<Buffer> {
    try {
      if (id) {
        const query = { _id: new ObjectId(id) };
        const result = (await getCollection("Livros")?.collection?.findOne(
          query
        )) as Livro;
        return getArchive(result.linkSistema + ".pdf");
      } else {
        throw new Error("O id(livro) não foi recebido com sucesso.");
      }
    } catch (error: any) {
      throw new Error(`Ocorre um erro na obtenção do pdf ${error}`);
    }
  }

  public deletePessoa(id: ObjectId){
    throw new Error("Esse método não deve utilizar essa função!!");
    
  }
}
