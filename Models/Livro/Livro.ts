export class Livro{
    nome: string;
    autor: string;
    dataPublicacao: Date;
    linkSistema: string;

    constructor(nome:string, autor:string, dataPublicacao: Date, linkSistema:string){
        this.nome = nome;
        this.autor = autor;
        this.dataPublicacao = dataPublicacao;
        this.linkSistema = linkSistema;
    }
}