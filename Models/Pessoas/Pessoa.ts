// Realiza a importação dos modulos necessários
import { ObjectId } from "mongodb";

// Define o objeto modelo Pessoa
export class Pessoa {
  id?: ObjectId;
  Nome: string;
  Idade: number;
  CPF: number;
  // Endereco: Endereco;

  // É um construtor, definindo as informações essenciais das classes filhas
  constructor(Nome: string, Idade: number, CPF: number, id?: ObjectId) {
    if (id) {
      this.id = id;
    }
    this.Nome = Nome;
    this.Idade = Idade;
    this.CPF = CPF;
  }

  // Getters e Setters
  public getCPF(): number {
    return this.CPF;
  }
}
