import {ObjectID} from 'bson';

export class Atividade {

    _id: ObjectID;
    titulo: string;
    descricao: string;
    materia: ObjectID;
    data_entrega: Date;
    
    constructor(titulo: string, descricao: string, data_entrega: Date, materia: ObjectID, _id?: ObjectID) {
        _id? this._id = _id: this._id = new ObjectID();
        this.titulo = titulo;
        this.descricao = descricao;
        this.materia = materia;
        this.data_entrega = data_entrega;
    }
}

export class RespostaAtividade {

    resposta: any[];
    entregue: boolean;
    atividade: ObjectID;

    constructor(resposta: any[], atividade: string, entregue?: boolean) {
        this.resposta = resposta;
        entregue? this.entregue = entregue: this.entregue = false;
        this.atividade = new ObjectID(atividade);
    }
}