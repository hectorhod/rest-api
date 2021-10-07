import { Aluno } from "./Aluno";
import { Pessoa } from "./Pessoa";

export class Diretor extends Pessoa{
    alunosAceitos: Aluno[] = []

    constructor(Nome:string, Idade:number, CPF:number){
        super(Nome, Idade, CPF)
    }
}