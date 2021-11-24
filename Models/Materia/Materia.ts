import { ObjectId } from "bson";
import { objectIDArray } from "../Decorators/variable";
import { Livro } from "../Livro/Livro";

export default class Materia {
  _id: ObjectId;
  nome: string;
  professor: ObjectId;
  turma: ObjectId;
  @objectIDArray()
  livros: ObjectId[] = [];
  @objectIDArray()
  atividades: ObjectId[] = [];
  /*TODO:
        Definir o limite da turma por matéria
        Definir o período da turma necessária
        Talvez colocar o 'census'
    ]*/

  constructor(nome: string, professor: ObjectId, turma: ObjectId, id?: ObjectId) {
    id ? (this._id = id) : (this._id = new ObjectId());
    this.nome = nome;
    this.professor = professor;
    this.turma = turma;
  }

}
