// Realiza a importação dos modulos necessários
import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Aluno } from "../../Models/Pessoas/Aluno";
import { TipoPessoa } from "../../Models/Pessoas/TipoPessoa/TipoPessoa";
import { getCollection } from "../../MongoDB/MongoController";
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

  protected async getAllUsers() {
    const collection = getCollection("Alunos");
    if (collection) {
      // Obtém todos os users do MongoDB
      const users = (await collection?.collection
        ?.find({})
        .toArray()) as Aluno[];
      return users;
    } else {
      // Joga um novo erro caso não exista uma collection
      throw new Error("Collections Alunos estava nulo!");
    }
  }

  public async getAlunoById(id: string): Promise<Aluno> {
    const result = await this.queryAluno(
      undefined,
      undefined,
      undefined,
      id
    );
    return result;
  }

  public async getAlunoByNome(Nome: string | undefined): Promise<Aluno> {
    if (Nome) {
      const result = await this.queryAluno(Nome);
      return result;
    } else {
      throw new Error("o Nome é nulo!!");
    }
  }

  protected async queryAluno(
    Nome?: string,
    Idade?: number,
    CPF?: number,
    id?: string
  ): Promise<Aluno> {
    try {
      // let query = {_id: id,username:username, password: password, email: email, pessoa: pessoa, tipoPessoa: tipoPessoa, active: active};
      let query = {} as Aluno;
      if (Nome) {
        query.Nome = Nome;
      }
      if (Idade) {
        query.Idade = Idade;
      }
      if (CPF) {
        query.CPF = CPF;
      }
      if (id) {
        query._id = new ObjectId(id);
      }


      if (query) {
        const result: Aluno = (await getCollection("Alunos")?.collection?.findOne(
          query
        )) as Aluno;
        return result;
      } else {
        throw new Error("Ocorreu um erro ao obter a query");
      }
    } catch (error: any) {
      throw new Error(`Ocorreu um erro ao obter o objeto: ${error}`);
    }
  }
}
