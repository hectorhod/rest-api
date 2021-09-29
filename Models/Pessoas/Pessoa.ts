import {ObjectId} from "mongodb"
export class Pessoa {
    id?: ObjectId;
    Nome: string;
    Idade: number;
    CPF: number;
    // Endereco: Endereco;

    constructor(Nome:string, Idade:number, CPF:number, id?: ObjectId){
        if(id){
            this.id = id;
        }
        this.Nome = Nome;
        this.Idade = Idade;
        this.CPF = CPF;

    }

    /**
     * getCPF
     */
     public getCPF():number {
        return(this.CPF);
    }
}

