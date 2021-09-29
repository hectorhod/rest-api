import { ObjectId } from "mongodb";
import { Pessoa } from "./Pessoa";

export class Aluno extends Pessoa {
    Matricula: number;

    constructor(Nome:string, Idade:number, CPF:number, Matricula:number, id?:ObjectId){
        super(Nome, Idade, CPF, id)
        this.Matricula = Matricula;
    }

    /**
     * getMatricula
     */
    public getMatricula():number {
        return(this.Matricula);
    }
}