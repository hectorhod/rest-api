// Realiza a importação dos modulos necessários
import { ObjectId } from "mongodb";
import { Pessoa } from "./Pessoa";

// Define o objeto modelo Aluno
export class Aluno extends Pessoa {
  // Objetos Exclusivos do Aluno
  Matricula: number;

  // É um construtor, define a classe pai Pessoa
  constructor(
    Nome: string,
    Idade: number,
    CPF: number,
    Matricula: number,
    id?: ObjectId
  ) {
    super(Nome, Idade, CPF, id);
    this.Matricula = Matricula;
  }

  // Getters e Setters
  public getMatricula(): number {
    return this.Matricula;
  }
}
