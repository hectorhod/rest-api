export class Pessoa {
    _id: string;
    Nome: string;
    Idade: number;
    #CPF: number;
    // Endereco: Endereco;

    constructor(Nome:string, Idade:number, CPF:number){
        this.Nome = Nome;
        this.Idade = Idade;
        this.#CPF = CPF;

    }

    /**
     * getCPF
     */
     public getCPF():number {
        return(this.#CPF);
    }
}

