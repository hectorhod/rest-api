import { ObjectId } from "bson";

export class Livro{
    _id: ObjectId
    nome: string;
    autor: string;
    volume: number;
    ano: number;
    linkSistema: string;

    constructor(nome:string, autor:string, volume:number, ano: number, linkSistema:string, id?:ObjectId){
        id? this._id = id : this._id = new ObjectId();
        this.nome = nome;
        this.autor = autor;
        this.volume = volume;
        this.ano = ano;
        this.linkSistema = linkSistema;
    }
}