import { ObjectId } from "bson";
import { objectIDArray } from "../Decorators/variable";
import Materia from "../Materia/Materia";
import { Aluno } from "../Pessoas/Aluno";

export class Turma {
  _id: ObjectId;
  @objectIDArray()
  materias: ObjectId[] = [];
  @objectIDArray()
  alunos: ObjectId[] = [];
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

  // public getMaterias() {
  //   return this.materias;
  // }

  // public getAlunos() {
  //   return this.alunos;
  // }
  
  // public addMateria(materia: string){
  //   this.materias.push(materia));
  // }

//   public addAluno(aluno: string){
//     this.alunos.push(aluno));
//   }
}
