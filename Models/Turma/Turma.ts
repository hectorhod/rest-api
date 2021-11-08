import { ObjectId } from "bson";
import Materia from "../Materia/Materia";
import { Aluno } from "../Pessoas/Aluno";

export class Turma {
  _id: ObjectId;
  protected materias: Materia[] = [];
  protected alunos: Aluno[] = [];
  periodo: number;
  dataInicio: Date;

  constructor(
    periodo: number,
    dataInicio: Date,
    idDiretor: ObjectId,
    id?: ObjectId
  ) {
    id ? (this._id = id) : (this._id = new ObjectId());
    this.periodo = periodo;
    this.dataInicio = dataInicio;
  }

  public getID(): ObjectId {
    return this._id;
  }

  public getMaterias() {
    return this.materias;
  }

  public getAlunos() {
    return this.alunos;
  }
}
