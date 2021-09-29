import { Pessoa } from "./Pessoa";

export class Aluno extends Pessoa {

     #Matricula: number;

    constructor(Nome:string, Idade:number, CPF:number, Matricula:number){
        super(Nome, Idade, CPF)
        this.#Matricula = Matricula;
    }

    /**
     * getMatricula
     */
    public getMatricula():number {
        return(this.#Matricula);
    }
}