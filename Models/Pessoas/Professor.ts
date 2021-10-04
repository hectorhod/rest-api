// Realiza a importação dos modulos necessários
import { Pessoa } from "./Pessoa";

// Define o objeto modelo Professor
export class Professor extends Pessoa {
    // Objetos Exclusivos do Professor
    Turmas: number[] = [];
    Materia: string;

    // É um construtor, define a classe pai Pessoa
    constructor(Nome:string, Idade:number, CPF:number, Materia:string){
        super(Nome, Idade, CPF)
        this.Materia = Materia;
    }

    // Getters e Setters
}