// Realiza a importação dos modulos necessários
import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Aluno } from "../../Models/Pessoas/Aluno";
import { TipoPessoa } from "../../Models/Pessoas/TipoPessoa/TipoPessoa";
import { Turma } from "../../Models/Turma/Turma";
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

  public async deletePessoa(id: ObjectId) {
    try {
      if (id) {

        // Cria uma query de pesquisa com o id recebido
        const query = { _id: id };
        const turmaCollection = getCollection("Turmas")

        // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
        const result = await getCollection("Alunos")?.collection?.deleteOne(
          query
        );

        const turmas = await (turmaCollection.collection.find({alunos: id})).toArray() as Turma[]
        turmas.forEach(async (turma) =>{
          let index = turma.alunos.indexOf(id,0);
          if(index > -1){
            turma.alunos.splice(index,1)
          }
          await turmaCollection.collection.updateOne({_id: turma._id}, {$set: turma})
        })

        // Exibe o resultado da operação anterior
        result
          ? (console.log("Aluno removido com sucesso com o id " + id))
          : (console.log("Aluno não foi removido."));
      } else {
        throw new Error("A requisição não pode ser concluida pela falta do ID");
      }
    } catch (error: any) {
      // Imprime um erro no console
      console.log(error);

    }
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
