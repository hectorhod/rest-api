import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import Materia from "../../Models/Materia/Materia";
import { getCollection } from "../../MongoDB/MongoController";
import { CommonRoutes } from "../../Routes/CommonRoutes/CommonRoutes";
import { Api } from "../RestController";

export class ProfessorRoutes extends CommonRoutes {
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
        const materiaCollection = getCollection("Materias")

        // Obtem a COLLECTION necessária da lista de collection e tenta remover o objeto
        const result = await getCollection("Professors")?.collection?.deleteOne(
          query
        );

        const materias = await (materiaCollection.collection.find({professor: id})).toArray() as Materia[]
        materias.forEach(async (materia) =>{
          materia.professor = null;
          await materiaCollection.collection.updateOne({_id: materia._id}, {$set: materia})
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
}
