import { ObjectId } from "bson";
import { Livro } from "../Livro/Livro";

export default class Materia {
  _id: ObjectId;
  nome: string;
  professor: ObjectId;
  turma: ObjectId;
  private livros: ObjectId[] = [];
  private atividades: ObjectId[] = [];
  /*TODO:
        Definir o limite da turma por matéria
        Definir o período da turma necessária
        Talvez colocar o 'census'
    ]*/

  constructor(nome: string, professor: ObjectId, turma: string, id?: ObjectId) {
    id ? (this._id = id) : (this._id = new ObjectId());
    this.nome = nome;
    this.professor = professor;
    this.turma = new ObjectId(turma);
  }

  public getLivros(): ObjectId[] {
    return this.livros;
  }

  public addLivro(livro: string){
      this.livros.push(new ObjectId(livro));
  }

  public getAtividades(): ObjectId[] {
      return this.atividades;
  }

  public addAtividade(atividade: string): void {
      this.atividades.push(new ObjectId(atividade));
  }

  /* Deixa por aqui, vou ver se é necessário dps, creio que não, mas né ...
    public addLivro(livro: Livro, idProfessor: ObjectId){
        if(idProfessor === this.professor){
            this.livros.push(livro);
            console.log("Livro %s adicionado com sucesso", livro.nome)
        }else{
            console.log("O id ( %s ) não é responsável pela matéria.",idProfessor.toString)
        }
    }

    public alteraLivro(livro: Livro, idProfessor: ObjectId){
        if(idProfessor === this.professor){
            this.livros.push(livro);
            console.log("Livro %s alterado com sucesso", livro.nome)
        }else{
            console.log("O id ( %s ) não é responsável pela matéria.",idProfessor.toString)
        }
    }

    public removeLivro(livro: Livro, idProfessor: ObjectId){
        if(idProfessor === this.professor){
            this.livros.push(livro);
            console.log("Livro %s removido com sucesso", livro.nome)
        }else{
            console.log("O id ( %s ) não é responsável pela matéria.",idProfessor.toString)
        }
    }*/
}
