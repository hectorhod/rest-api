// Realiza a importação dos modulos necessários
import { ObjectId } from "mongodb";
import { Pessoa } from "./Pessoa";

// Define o objeto modelo Aluno
export class Aluno extends Pessoa {
  // Objetos Exclusivos do Aluno

  // É um construtor, define a classe pai Pessoa
  constructor(
    Nome: string,
    Idade: number,
    CPF: number,
  ) {
    super(Nome, Idade, CPF);
  }

  
}
