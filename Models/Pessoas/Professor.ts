// Realiza a importação dos modulos necessários
import { ObjectId } from "bson";
import { objectIDArray } from "../Decorators/variable";
import Materia from "../Materia/Materia";
import { Pessoa } from "./Pessoa";

// Define o objeto modelo Professor
export class Professor extends Pessoa {
  // Objetos Exclusivos do Professor
  @objectIDArray()
  Turmas: ObjectId[] = [];
  @objectIDArray()
  Materia: ObjectId[] = [];

  // É um construtor, define a classe pai Pessoa
  constructor(Nome: string, Idade: number, CPF: number) {
    super(Nome, Idade, CPF);
  }

  // Getters e Setters
}
