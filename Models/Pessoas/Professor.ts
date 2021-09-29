import { Pessoa } from "./Pessoa";
export class Professor extends Pessoa {
    Turmas: Array<number>;
    Materia: string;

    constructor(Nome:string, Idade:number, CPF:number, Materia:string){
        super(Nome, Idade, CPF)
        this.Materia = Materia;
    }
}