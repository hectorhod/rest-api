// Realiza a importação dos modulos necessários
import { ObjectId } from "mongodb";

// Define o objeto modelo Pessoa
export class Pessoa {
  _id: ObjectId;
  Nome: string;
  Idade: number;
  CPF: number;
  // Endereco: Endereco;

  // É um construtor, definindo as informações essenciais das classes filhas
  constructor(Nome: string, Idade: number, CPF: number, id?: ObjectId) {
    id ? this._id = id : this._id = new ObjectId;
    this.Nome = Nome;
    this.Idade = Idade;
    this.CPF = CPF;
  }

  // Getters e Setters
  public getCPF(): number {
    return this.CPF;
  }
}
